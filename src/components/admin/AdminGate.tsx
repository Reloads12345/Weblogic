"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isAuthed } from "@/components/admin/AdminAuth";

/**
 * Wrapper that renders its children only when the user is authenticated.
 * Otherwise redirects to /admin (login).
 */
export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthed()) {
      setOk(true);
    } else {
      router.replace("/admin");
    }
    setChecking(false);
  }, [router]);

  if (checking || !ok) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink-0 text-mute">
        <Loader2 className="h-5 w-5 animate-spin" />
      </main>
    );
  }

  return <>{children}</>;
}
