"use client";

import { useEffect, useState } from "react";

const TRANSITION_MS = 600;

export function HeroTextRotator({
  headings,
  subheadings,
  intervalMs = 5000,
}: {
  headings: string[];
  subheadings: string[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [entered, setEntered] = useState(false);
  const hasMultiple = headings.length > 1;

  // Initial entrance, mirrors the fade-up used elsewhere in the hero.
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Cycle to the next heading/subheading pair, fading out then back in.
  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setEntered(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % headings.length);
        setEntered(true);
      }, TRANSITION_MS);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [hasMultiple, headings.length, intervalMs]);

  const heading = headings[index] ?? headings[0] ?? "";
  const subheading = subheadings.length ? subheadings[index % subheadings.length] : null;

  return (
    <>
      <h1
        className={[
          "font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl",
          "transition-all ease-out",
          "duration-500",
          entered ? "translate-y-0 opacity-100 blur-none" : "translate-y-4 opacity-0 blur-sm",
        ].join(" ")}
      >
        {heading}
      </h1>
      {subheading && (
        <p
          className={[
            "mt-6 max-w-xl text-base leading-relaxed text-white/70",
            "transition-all delay-100 duration-500 ease-out",
            entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          ].join(" ")}
        >
          {subheading}
        </p>
      )}
    </>
  );
}
