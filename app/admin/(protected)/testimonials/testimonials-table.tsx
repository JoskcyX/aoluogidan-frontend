"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import type { Testimonial } from "@/lib/types";

export function TestimonialsTable({ initialRows }: { initialRows: Testimonial[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);

  const patch = async (row: Testimonial, field: "published" | "featured") => {
    const next = !row[field];
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [field]: next } : r)));
    const res = await fetch(`/api/admin/testimonials/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    });
    if (!res.ok) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [field]: row[field] } : r)));
      toast.error("Couldn't update.");
    }
  };

  const handleDelete = async (row: Testimonial) => {
    const res = await fetch(`/api/admin/testimonials/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Couldn't delete.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    toast.success("Deleted.");
    router.refresh();
  };

  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate">
          <tr>
            <th className="px-5 py-3">Client</th>
            <th className="px-5 py-3">Testimonial</th>
            <th className="px-5 py-3">Published</th>
            <th className="px-5 py-3">Featured</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-3 font-medium text-ink">{row.clientName}</td>
              <td className="max-w-sm truncate px-5 py-3 text-slate">{row.testimonial}</td>
              <td className="px-5 py-3">
                <button onClick={() => patch(row, "published")}>
                  <Badge variant={row.published ? "success" : "neutral"}>{row.published ? "Yes" : "No"}</Badge>
                </button>
              </td>
              <td className="px-5 py-3">
                <button onClick={() => patch(row, "featured")}>
                  <Badge variant={row.featured ? "default" : "neutral"}>{row.featured ? "Yes" : "No"}</Badge>
                </button>
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-4">
                  <Link href={`/admin/testimonials/${row.id}`} className="text-sm text-brass-deep hover:underline">Edit</Link>
                  <ConfirmButton label="Delete" confirmTitle="Delete this testimonial?" confirmDescription="This can't be undone." onConfirm={() => handleDelete(row)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
