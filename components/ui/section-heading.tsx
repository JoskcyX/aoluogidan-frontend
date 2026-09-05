import clsx from "clsx";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={clsx(
            "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
            light ? "text-brass" : "text-brass-deep"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx(
          "font-display text-3xl leading-tight sm:text-4xl",
          light ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={clsx("mt-4 text-base leading-relaxed", light ? "text-white/70" : "text-slate")}>
          {description}
        </p>
      )}
    </div>
  );
}
