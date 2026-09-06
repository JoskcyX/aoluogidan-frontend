"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Scale,
  Briefcase,
  Building,
  Lightbulb,
  Users,
  Landmark,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";

export const PRACTICE_ICONS: Record<string, React.ElementType> = {
  scale: Scale,
  briefcase: Briefcase,
  building: Building,
  lightbulb: Lightbulb,
  users: Users,
  landmark: Landmark,
};

const ACCENTS = [
  { text: "text-brass-deep", bg: "bg-brass-deep", ring: "border-brass-deep" },
  { text: "text-emerald-deep", bg: "bg-emerald-deep", ring: "border-emerald-deep" },
  { text: "text-burgundy", bg: "bg-burgundy", ring: "border-burgundy" },
  { text: "text-navy", bg: "bg-navy", ring: "border-navy" },
];

/**
 * A colourful box-card for a practice area. Click anywhere on the card to
 * expand it in place and reveal the full description before following the
 * link through to the detail page — works the same with touch or a mouse,
 * unlike a hover-only flip effect.
 */
export function PracticeAreaCard({ area, index }: { area: any; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = PRACTICE_ICONS[area.iconName ?? "scale"] ?? Scale;
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div
      className={clsx(
        "group relative flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        open && `border-t-4 ${accent.ring}`
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span
          className={clsx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-105",
            accent.bg
          )}
        >
          <Icon size={22} strokeWidth={1.75} />
        </span>
        <ChevronDown
          size={18}
          className={clsx("mt-2 shrink-0 text-slate transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <h3 className="mt-5 font-display text-lg text-ink">{area.name}</h3>

      <div
        className="grid overflow-hidden transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <p className="mt-2 text-sm leading-relaxed text-slate">{area.shortDescription}</p>
        </div>
      </div>

      <Link
        href={`/practice-areas/${area.slug}`}
        className={clsx(
          "mt-4 inline-flex items-center gap-1 text-sm font-medium transition-all duration-300 hover:translate-x-1",
          accent.text
        )}
      >
        View details <ArrowRight size={14} />
      </Link>
    </div>
  );
}
