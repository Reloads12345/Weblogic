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
      const data = (await res.json()) as {
        assets?: AssetMap;
        mode?: UploadMode;
      };
      setAssets(data.assets ?? {});
      setUploadMode(data.mode ?? "unknown");
      setLastError(null);
      console.log(
        "[media-admin] manifest_loaded",
        JSON.stringify({
          mode: data.mode,
          count: Object.keys(data.assets ?? {}).length,
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

        // Optimistic local update — give the user instant feedback.
        // The `?v=` cache-bust matters mostly for the filesystem branch.
        setAssets((prev) => ({
          ...prev,
          [slot]: {
            url: json.url!,
            type: json.type ?? "image",
            uploadedAt: json.uploadedAt ?? Date.now(),
          },
        }));
        console.log(
          "[media-admin] upload_success",
          JSON.stringify({ slot, type: json.type }),
        );

        // Authoritative refetch so the cached manifest matches storage exactly.
        await refreshManifest();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setLastError(msg);
        console.error("[media-admin] upload_threw", msg);
      } finally {
        setIsUploading(null);
      }
    },
    [refreshManifest],
  );

  const clearAsset = useCallback(
    async (slot: string) => {
      setLastError(null);
      try {
        const res = await fetch(
          `/api/upload?slot=${encodeURIComponent(slot)}`,
          { method: "DELETE" },
        );
        if (!res.ok) {
          const json = await res.json().catch(() => ({ error: "" }));
          setLastError(json.error || `Delete failed (HTTP ${res.status})`);
          return;
        }
        setAssets((prev) => {
          const next = { ...prev };
          delete next[slot];
          return next;
        });
        await refreshManifest();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Delete failed";
        setLastError(msg);
      }
    },
    [refreshManifest],
  );

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
