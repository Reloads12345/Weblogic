"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AssetMap {
  [slot: string]: { url: string; type: "video" | "image" | "document"; uploadedAt: number };
}

interface Ctx {
  assets: AssetMap;
  setAsset: (slot: string, file: File) => Promise<void>;
  clearAsset: (slot: string) => Promise<void>;
  getVideoUrl: (slot: string) => string | undefined;
  getImageUrl: (slot: string) => string | undefined;
  getDocumentUrl: (slot: string) => string | undefined;
  isUploading: string | null;
}

const AssetCtx = createContext<Ctx | null>(null);

export default function AssetProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<AssetMap>({});
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // Load existing manifest on mount
  useEffect(() => {
    fetch("/api/upload", { method: "GET" })
      .then((r) => (r.ok ? r.json() : { assets: {} }))
      .then((data) => {
        if (data.assets) setAssets(data.assets);
      })
      .catch(() => {});
  }, []);

  const setAsset = useCallback(async (slot: string, file: File) => {
    setIsUploading(slot);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slot", slot);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setAssets((prev) => ({
        ...prev,
        [slot]: {
          url: `${data.url}?v=${Date.now()}`,
          type: data.type,
          uploadedAt: Date.now(),
        },
      }));
    } finally {
      setIsUploading(null);
    }
  }, []);

  const clearAsset = useCallback(async (slot: string) => {
    await fetch(`/api/upload?slot=${encodeURIComponent(slot)}`, { method: "DELETE" });
    setAssets((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  }, []);

  const getVideoUrl = useCallback(
    (slot: string) => {
      const a = assets[slot];
      if (a && a.type === "video") return a.url;
      return undefined;
    },
    [assets],
  );

  const getImageUrl = useCallback(
    (slot: string) => {
      const a = assets[slot];
      if (a && a.type === "image") return a.url;
      return undefined;
    },
    [assets],
  );

  const getDocumentUrl = useCallback(
    (slot: string) => {
      const a = assets[slot];
      if (a && a.type === "document") return a.url;
      return undefined;
    },
    [assets],
  );

  const value = useMemo<Ctx>(
    () => ({ assets, setAsset, clearAsset, getVideoUrl, getImageUrl, getDocumentUrl, isUploading }),
    [assets, setAsset, clearAsset, getVideoUrl, getImageUrl, getDocumentUrl, isUploading],
  );

  return <AssetCtx.Provider value={value}>{children}</AssetCtx.Provider>;
}

export function useAssets() {
  const ctx = useContext(AssetCtx);
  if (!ctx) throw new Error("useAssets must be used within AssetProvider");
  return ctx;
}
