"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { ConfirmButton } from "@/components/admin/confirm-button";
import type { Media } from "@/lib/types";

export function MediaGrid({ initialFiles }: { initialFiles: Media[] }) {
  const [files, setFiles] = useState(initialFiles);
  const [query, setQuery] = useState("");

  const handleDelete = async (file: Media) => {
    const res = await fetch(`/api/admin/media/${file.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Couldn't delete file.");
      return;
    }
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    toast.success("File deleted.");
  };

  const filtered = files.filter((f) => f.filename.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <Input placeholder="Search files…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {filtered.map((file) => (
          <div key={file.id} className="group relative border border-line bg-white">
            <div className="aspect-square overflow-hidden bg-surface">
              {file.mimeType.startsWith("image/") ? (
                <Image src={file.url} alt={file.alt ?? file.filename} width={200} height={200} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate">File</div>
              )}
            </div>
            <div className="p-2">
              <p className="truncate text-xs text-slate">{file.filename}</p>
            </div>
            <div className="absolute inset-x-0 top-0 flex justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <ConfirmButton
                label="Delete"
                confirmTitle="Delete this file?"
                confirmDescription="If this image is used elsewhere on the site, that reference will be broken."
                onConfirm={() => handleDelete(file)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
