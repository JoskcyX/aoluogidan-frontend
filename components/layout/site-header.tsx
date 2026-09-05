"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/team", label: "Our Team" },
  { href: "/insights", label: "Insights" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ firmName }: { firmName: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur transition-shadow duration-300",
        scrolled && "shadow-sm"
      )}
    >
      <div
        className={clsx(
          "mx-auto flex max-w-7xl items-center justify-between px-6 transition-[height] duration-300 lg:px-10",
          scrolled ? "h-16" : "h-20"
        )}
      >
        <Link href="/" className="font-display text-xl tracking-tight text-ink transition-transform duration-200 hover:scale-[1.02]">
          {firmName}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm font-medium text-ink/80 transition-colors hover:text-brass-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/consultation">
            <Button size="sm" className="transition-transform duration-200 hover:scale-105">
              Book a Consultation
            </Button>
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-6 w-6">
            <Menu
              size={24}
              className={clsx(
                "absolute inset-0 transition-all duration-200",
                open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
              )}
            />
            <X
              size={24}
              className={clsx(
                "absolute inset-0 transition-all duration-200",
                open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
              )}
            />
          </span>
        </button>
      </div>

      <nav
        className={clsx(
          "overflow-hidden border-t border-line bg-white transition-[max-height,opacity] duration-300 ease-out lg:hidden",
          open ? "max-h-[26rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col px-6 py-4">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-3 text-sm font-medium text-ink transition-colors hover:text-brass-deep"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/consultation" onClick={() => setOpen(false)}>
            <Button size="sm" className="mt-4 w-full">
              Book a Consultation
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
