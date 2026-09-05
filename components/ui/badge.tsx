import clsx from "clsx";

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "neutral" }) {
  return (
    <span
      className={clsx("inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium", {
        "bg-brass/10 text-brass-deep": variant === "default",
        "bg-green-50 text-green-700": variant === "success",
        "bg-amber-50 text-amber-700": variant === "warning",
        "bg-gray-100 text-gray-600": variant === "neutral",
      })}
    >
      {children}
    </span>
  );
}
