"use client";

import AdminGate from "@/components/admin/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/navigation";
import { logout } from "@/components/admin/AdminAuth";
import { LogOut } from "lucide-react";

export default function Page() {
  const router = useRouter();

  return (
    <AdminGate>
      <AdminLayout title="Settings" subtitle="Account & site configuration.">
        <section className="rounded-2xl border border-white/8 bg-ink-50/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / Account
          </p>
          <p className="mt-3 text-bone">Signed in as <span className="text-bone">weblogic</span></p>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/admin");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-xs text-red-400 transition hover:bg-red-500/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </section>

        <section className="mt-6 rounded-2xl border border-white/8 bg-ink-50/40 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
            / Email delivery
          </p>
          <p className="mt-3 text-sm text-bone/85">
            Lead-capture forms send via Resend when{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5">RESEND_API_KEY</code>{" "}
            and <code className="rounded bg-white/5 px-1.5 py-0.5">LEAD_TO_EMAIL</code>{" "}
            are set in <code className="rounded bg-white/5 px-1.5 py-0.5">.env.local</code>.
          </p>
          <p className="mt-2 text-sm text-mute">
            Sign up at <span className="text-bone">resend.com</span> (free, 3,000 emails / month).
          </p>
        </section>
      </AdminLayout>
    </AdminGate>
  );
}
