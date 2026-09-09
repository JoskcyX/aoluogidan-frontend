"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  Scale,
  Newspaper,
  Quote,
  HelpCircle,
  Inbox,
  GraduationCap,
  Image as ImageIcon,
  FileText,
  Settings,
  ShieldCheck,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/lawyers", label: "Lawyers", icon: Users },
  { href: "/admin/practice-areas", label: "Practice Areas", icon: Scale },
  { href: "/admin/blog", label: "Insights", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/internships", label: "Internships", icon: GraduationCap, notificationKey: "internships" as const },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/page-heroes", label: "Page Hero Images", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Admin Users", icon: ShieldCheck, superAdminOnly: true },
];

const LAST_SEEN_KEY = "admin:internships:lastSeenCount";
const POLL_INTERVAL_MS = 30_000;

/** Polls for new internship applicants and surfaces a badge + toast. */
function useInternshipNotifications() {
  const [count, setCount] = useState(0);
  const lastSeen = useRef<number | null>(null);

  useEffect(() => {
    if (lastSeen.current === null) {
      const stored = Number(window.localStorage.getItem(LAST_SEEN_KEY));
      lastSeen.current = Number.isFinite(stored) ? stored : 0;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch("/api/admin/internships/unread-count", { cache: "no-store" });
        if (!res.ok) return;
        const { count: next } = await res.json();
        if (cancelled || typeof next !== "number") return;

        setCount(next);
        if (lastSeen.current !== null && next > lastSeen.current) {
          const newOnes = next - lastSeen.current;
          toast(`${newOnes} new internship ${newOnes === 1 ? "application" : "applications"} received.`, {
            icon: "🎓",
          });
        }
        lastSeen.current = next;
        window.localStorage.setItem(LAST_SEEN_KEY, String(next));
      } catch {
        // Ignore — likely just means the internship backend isn't live yet.
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return count;
}

export function AdminSidebar({ role, userName }: { role: "SUPER_ADMIN" | "EDITOR"; userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };
  const [open, setOpen] = useState(false);
  const newInternshipCount = useInternshipNotifications();

  const items = NAV.filter((item) => !item.superAdminOnly || role === "SUPER_ADMIN");

  const Nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        const badgeCount = item.notificationKey === "internships" ? newInternshipCount : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={clsx(
              "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-brass/10 text-brass-deep" : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={17} />
            <span className="flex-1">{item.label}</span>
            {badgeCount > 0 && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brass px-1.5 text-[11px] font-semibold text-ink">
                {badgeCount > 99 ? "99+" : badgeCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-ink px-4 py-4 lg:hidden">
        <span className="font-display text-white">Admin</span>
        <button onClick={() => setOpen((v) => !v)} className="text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop for the mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={clsx(
          "z-30 flex w-72 flex-col overflow-y-auto bg-ink lg:sticky lg:top-0 lg:h-screen",
          open ? "fixed inset-y-0 left-0" : "hidden lg:flex"
        )}
      >
        <div className="hidden border-b border-white/10 px-6 py-6 lg:block">
          <p className="font-display text-lg text-white">A. Oluogidan & Co</p>
          <p className="text-xs text-white/40">Admin Dashboard</p>
        </div>
        {Nav}
        <div className="border-t border-white/10 px-4 py-4">
          <p className="truncate px-2 text-xs text-white/40">Signed in as</p>
          <p className="truncate px-2 text-sm text-white">{userName}</p>
          <button
            onClick={handleSignOut}
            className="mt-3 flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
