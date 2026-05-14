"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Image as ImageIcon,
  FileText,
  Briefcase,
  Users,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { logout } from "@/components/admin/AdminAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/dashboard/work", label: "Work projects", icon: Briefcase },
  { href: "/admin/dashboard/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/dashboard/content", label: "Homepage Content", icon: FileText },
  { href: "/admin/dashboard/cases", label: "Case Studies", icon: Users },
  { href: "/admin/dashboard/settings", label: "Settings", icon: Settings },
];

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const onLogout = () => {
    logout();
    router.replace("/admin");
  };

  return (
    <div className="min-h-screen bg-ink-0 text-bone">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="border-b border-white/8 bg-ink-50/40 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-4 lg:py-5">
            <Link href="/" className="inline-flex items-center" aria-label="WebLogic — home">
              <Logo size="md" />
            </Link>
            <span className="rounded-full border border-electric/40 bg-electric/10 px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.18em] text-electric">
              Admin
            </span>
          </div>

          <nav className="px-3 py-4">
            <ul className="space-y-0.5">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                        active
                          ? "bg-electric/10 text-electric"
                          : "text-bone/75 hover:bg-white/[0.03] hover:text-bone",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="absolute bottom-0 hidden w-[260px] border-t border-white/8 px-3 py-4 lg:block">
            <Link
              href="/"
              className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-bone/75 transition hover:bg-white/[0.03] hover:text-bone"
            >
              <ExternalLink className="h-4 w-4" />
              View site
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-bone/75 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="relative">
          <header className="sticky top-0 z-10 border-b border-white/8 bg-ink-0/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-4 md:px-10 md:py-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  / WebLogic Admin
                </p>
                <h1 className="mt-1.5 font-display text-2xl tracking-tightest text-bone md:text-3xl">
                  {title}
                </h1>
                {subtitle && <p className="mt-1 text-sm text-mute">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs text-bone/80 transition hover:border-red-500/40 hover:text-red-400 lg:hidden"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </header>

          <div className="px-6 py-8 md:px-10 md:py-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
