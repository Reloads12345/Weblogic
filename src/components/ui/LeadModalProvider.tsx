"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import LeadModal from "@/components/ui/LeadModal";

interface Ctx {
  open: (source?: string) => void;
  close: () => void;
  isOpen: boolean;
  source: string | null;
}

const LeadCtx = createContext<Ctx | null>(null);

export default function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [source, setSource] = useState<string | null>(null);

  const open = useCallback((src?: string) => {
    setSource(src ?? null);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close, source }), [isOpen, open, close, source]);

  return (
    <LeadCtx.Provider value={value}>
      {children}
      <LeadModal />
    </LeadCtx.Provider>
  );
}

export function useLeadModal() {
  const ctx = useContext(LeadCtx);
  if (!ctx) throw new Error("useLeadModal must be used within LeadModalProvider");
  return ctx;
}
