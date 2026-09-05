"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageUploader({
  value,
  onChange,
  folder = "general",
  label = "Photo",
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder?: "lawyers" | "blog" | "practice-areas" | "testimonials" | "general";
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error ?? "Upload failed.");
      }

      onChange(body.media.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden border border-line bg-surface">
          {value ? (
            <Image src={value} alt="" width={96} height={96} className="h-full w-full object-cover" />
          ) : (
            <Upload className="text-slate" size={20} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </Button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1 text-xs text-slate hover:text-red-600"
            >
              <X size={12} /> Remove
            </button>
          )}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate">JPG, PNG, or WEBP — up to 8MB.</p>
    </div>
  );
}
