import { forwardRef } from "react";
import clsx from "clsx";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-brass",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx(
        "w-full border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-brass",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx("w-full border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-brass", className)}
      {...props}
    />
  )
);
Select.displayName = "Select";

export function Label({ children, htmlFor, required }: { children: React.ReactNode; htmlFor: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children} {required && <span className="text-brass-deep">*</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}
