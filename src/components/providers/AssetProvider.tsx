"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ───────────────────────────────────────────────────────────────
 * AssetProvider — client-side cache of the admin upload manifest.
 *
 * On mount it fetches /api/upload (GET) and hydrates `assets` with
 * whatever the server already has on file. Every upload + delete
 * also REFETCHES the manifest so the UI is always in sync with
 * what's actually persisted (Vercel Blob in production, filesystem
 * in local dev).
 *
 * Errors are surfaced through `lastError` so the admin UI can
 * display them — silent failures were the root cause of
 * "0/45 stays 0/45 after upload" on production.
 * ─────────────────────────────────────────────────────────────── */

interface AssetEntry {
  url: string;
  type: "video" | "image" | "document";
  uploadedAt: number;
}

interface AssetMap {
  [slot: string]: AssetEntry;
}

export type UploadMode =
  | "vercel-blob"
  | "fs"
  | "disabled"
  | "no-blob-token"
  | "unknown";

interface Ctx {
  assets: AssetMap;
  /** Server-reported storage mode. Used by the admin diagnostics panel. */
  uploadMode: UploadMode;
  /** True between mount and first manifest fetch resolving. */
  manifestLoading: boolean;
  /** Last server error from a GET/POST/DELETE. Cleared on success. */
  lastError: string | null;
  /** Slot key of an in-flight upload, or null. */
  isUploading: string | null;
  setAsset: (slot: string, file: File) => Promise<void>;
  clearAsset: (slot: string) => Promise<void>;
  getVideoUrl: (slot: string) => string | undefined;
  getImageUrl: (slot: string) => string | undefined;
  getDocumentUrl: (slot: string) => string | undefined;
}

const AssetCtx = createContext<Ctx | null>(null);

/**
 * Append `?_v=<timestamp>` to every asset URL so the browser refetches
 * after a replace upload.
 *
 * Vercel Blob with `addRandomSuffix: false` returns the SAME public URL
 * when you overwrite a file at the same path. Without a cache-buster the
 * browser's HTTP image cache happily serves the old bytes — the user sees
 * the previous image and concludes the upload "didn't work."
 *
 * We rebuild the URL with the manifest's `uploadedAt` so the cache key
 * changes every time a slot is replaced.
 */
function withCacheBust(asset: AssetEntry): AssetEntry {
  if (!asset?.url) return asset;
  const sep = asset.url.includes("?") ? "&" : "?";
  return {
    ...asset,
    url: `${asset.url}${sep}_v=${asset.uploadedAt ?? Date.now()}`,
  };
}

function normalizeAssets(raw: AssetMap): AssetMap {
  const out: AssetMap = {};
  for (const slot of Object.keys(raw)) {
    const entry = raw[slot];
    if (entry?.url) out[slot] = withCacheBust(entry);
  }
  return out;
}

export default function AssetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assets, setAssets] = useState<AssetMap>({});
  const [uploadMode, setUploadMode] = useState<UploadMode>("unknown");
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [manifestLoading, setManifestLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);

  /** Pull the manifest from the server. Called on mount + after every mutation. */
  const refreshManifest = useCallback(async () => {
    try {
      const res = await fetch("/api/upload", {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        setLastError(
          `Manifest fetch failed (${res.status}). ${body.slice(0, 160)}`,
        );
        console.error("[media-admin] manifest_load_failed", res.status, body);
        return;
      }
      const raw = (await res.json().catch(() => ({}))) as {
        assets?: unknown;
        mode?: unknown;
      };
      // Defensive normalisation — never trust the server response shape
      // to be exactly what the UI expects. A malformed body here used to
      // be enough to crash the entire /admin tree.
      const safeAssets: AssetMap =
        raw && typeof raw.assets === "object" && raw.assets !== null
          ? (raw.assets as AssetMap)
          : {};
      const KNOWN_MODES: UploadMode[] = [
        "vercel-blob",
        "fs",
        "disabled",
        "no-blob-token",
        "unknown",
      ];
      const safeMode: UploadMode =
        typeof raw.mode === "string" &&
        (KNOWN_MODES as string[]).includes(raw.mode)
          ? (raw.mode as UploadMode)
          : "unknown";
      // Apply cache-busters so replaced assets force the browser to
      // re-fetch the new bytes (Blob overwrite at same path = same URL).
      setAssets(normalizeAssets(safeAssets));
      setUploadMode(safeMode);
      setLastError(null);
      console.log(
        "[media-admin] manifest_loaded",
        JSON.stringify({
          mode: safeMode,
          count: Object.keys(safeAssets).length,
        }),
      );
    } catch (err) {
      setLastError(err instanceof Error ? err.message : "Manifest fetch failed");
      console.error("[media-admin] manifest_fetch_threw", err);
    } finally {
      setManifestLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshManifest();
  }, [refreshManifest]);

  const setAsset = useCallback(
    async (slot: string, file: File) => {
      setIsUploading(slot);
      setLastError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        // Send both names — server accepts either. Matches the spec'd
        // `slotId` field while preserving the legacy `slot` name.
        formData.append("slot", slot);
        formData.append("slotId", slot);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = (await res
          .json()
          .catch(() => ({ error: "Invalid server response" }))) as {
          ok?: boolean;
          slot?: string;
          slotId?: string;
          url?: string;
          type?: "image" | "video" | "document";
          uploadedAt?: number;
          manifest?: AssetMap;
          mode?: UploadMode;
          error?: string;
          code?: string;
        };

        if (!res.ok || !json.url) {
          const msg =
            json.error ??
            `Upload failed (HTTP ${res.status})`;
          setLastError(msg);
          console.error(
            "[media-admin] upload_failed",
            JSON.stringify({ slot, status: res.status, error: msg, code: json.code }),
          );
          return;
        }

        // The server returns the FULL authoritative manifest. We use it
        // for OTHER slots' state, but for the SLOT WE JUST UPLOADED TO
        // we always inject a fresh client-side timestamp.
        //
        // Why: Vercel Blob's `list()` (which the server uses to derive
        // the manifest) can return a stale `uploadedAt` for a few hundred
        // ms right after an overwrite — meaning the cache-bust suffix
        // would match a value the browser has already cached, and the
        // browser would serve the OLD image even though the new bytes
        // are sitting at the same URL. A fresh client timestamp
        // guarantees the URL is unique → cache miss → new bytes load.
        const now = Date.now();
        const responseUrl = json.url ?? "";
        const freshEntry: AssetEntry = {
          url: `${responseUrl}${responseUrl.includes("?") ? "&" : "?"}_v=${now}`,
          type: json.type ?? "image",
          uploadedAt: now,
        };

        if (
          json.manifest &&
          typeof json.manifest === "object" &&
          !Array.isArray(json.manifest)
        ) {
          // Normalize every other entry as usual, but force the just-
          // uploaded slot to use our fresh timestamp.
          const normalized = normalizeAssets(json.manifest as AssetMap);
          normalized[slot] = freshEntry;
          setAssets(normalized);
          if (json.mode) setUploadMode(json.mode);
        } else {
          // No manifest in response — at least make sure this slot updates.
          setAssets((prev) => ({ ...prev, [slot]: freshEntry }));
        }
        console.log(
          "[media-admin] upload_success",
          JSON.stringify({ slot, type: json.type, v: now }),
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setLastError(msg);
        console.error("[media-admin] upload_threw", msg);
      } finally {
        setIsUploading(null);
      }
    },
    [],
  );

  const clearAsset = useCallback(async (slot: string) => {
    setLastError(null);
    try {
      const res = await fetch(
        `/api/upload?slot=${encodeURIComponent(slot)}`,
        { method: "DELETE" },
      );
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        manifest?: AssetMap;
        error?: string;
      };
      if (!res.ok) {
        setLastError(json.error || `Delete failed (HTTP ${res.status})`);
        return;
      }
      // Trust the manifest from the response (same race-fix as setAsset).
      if (
        json.manifest &&
        typeof json.manifest === "object" &&
        !Array.isArray(json.manifest)
      ) {
        setAssets(normalizeAssets(json.manifest));
      } else {
        setAssets((prev) => {
          const next = { ...prev };
          delete next[slot];
          return next;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      setLastError(msg);
    }
  }, []);

  const getVideoUrl = useCallback(
    (slot: string) => {
      const a = assets[slot];
      return a && a.type === "video" ? a.url : undefined;
    },
    [assets],
  );
  const getImageUrl = useCallback(
    (slot: string) => {
      const a = assets[slot];
      return a && a.type === "image" ? a.url : undefined;
    },
    [assets],
  );
  const getDocumentUrl = useCallback(
    (slot: string) => {
      const a = assets[slot];
      return a && a.type === "document" ? a.url : undefined;
    },
    [assets],
  );

  const value = useMemo<Ctx>(
    () => ({
      assets,
      uploadMode,
      manifestLoading,
      lastError,
      isUploading,
      setAsset,
      clearAsset,
      getVideoUrl,
      getImageUrl,
      getDocumentUrl,
    }),
    [
      assets,
      uploadMode,
      manifestLoading,
      lastError,
      isUploading,
      setAsset,
      clearAsset,
      getVideoUrl,
      getImageUrl,
      getDocumentUrl,
    ],
  );

  return <AssetCtx.Provider value={value}>{children}</AssetCtx.Provider>;
}

export function useAssets() {
  const ctx = useContext(AssetCtx);
  if (!ctx) throw new Error("useAssets must be used within AssetProvider");
  return ctx;
}
