import { Button } from "./button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed border-line px-6 py-16 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-slate">{description}</p>}
      {actionLabel && actionHref && (
        <a href={actionHref}>
          <Button size="sm" className="mt-6">
            {actionLabel}
          </Button>
        </a>
      )}
      {actionLabel && onAction && (
        <Button size="sm" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
