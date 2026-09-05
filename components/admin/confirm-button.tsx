"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmButton({
  onConfirm,
  label,
  confirmTitle,
  confirmDescription,
  variant = "danger",
}: {
  onConfirm: () => void | Promise<void>;
  label: string;
  confirmTitle: string;
  confirmDescription: string;
  variant?: "danger" | "secondary" | "ghost";
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={variant === "danger" ? "text-sm text-red-600 hover:underline" : "text-sm text-slate hover:text-ink hover:underline"}
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-6">
          <div className="w-full max-w-sm border border-line bg-white p-6">
            <p className="font-display text-lg text-ink">{confirmTitle}</p>
            <p className="mt-2 text-sm text-slate">{confirmDescription}</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button size="sm" variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  await onConfirm();
                  setBusy(false);
                  setOpen(false);
                }}
              >
                {busy ? "Working…" : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
