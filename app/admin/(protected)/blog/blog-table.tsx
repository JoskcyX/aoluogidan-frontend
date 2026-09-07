"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/admin/confirm-button";

type Row = {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: Date;
  authorName: string | null;
  categoryName: string | null;
};

export function BlogTable({ initialRows }: { initialRows: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);

  const handleDelete = async (row: Row) => {
    const res = await fetch(`/api/admin/blog/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Couldn't delete.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    toast.success("Article deleted.");
    router.refresh();
  };

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <div key={row.id} className="border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-ink">{row.title}</p>
              <Badge variant={row.status === "PUBLISHED" ? "success" : "neutral"}>{row.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate">
              {row.categoryName ?? "—"} · {row.authorName}
            </p>
            <div className="mt-3 flex justify-end gap-4 border-t border-line pt-3">
              <Link href={`/admin/blog/${row.id}`} className="text-sm text-brass-deep hover:underline">Edit</Link>
              <ConfirmButton label="Delete" confirmTitle="Delete this article?" confirmDescription={`"${row.title}" will be permanently removed.`} onConfirm={() => handleDelete(row)} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto border border-line bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Author</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="max-w-sm truncate px-5 py-3 font-medium text-ink">{row.title}</td>
                <td className="px-5 py-3 text-slate">{row.categoryName ?? "—"}</td>
                <td className="px-5 py-3 text-slate">{row.authorName}</td>
                <td className="px-5 py-3"><Badge variant={row.status === "PUBLISHED" ? "success" : "neutral"}>{row.status}</Badge></td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/blog/${row.id}`} className="text-sm text-brass-deep hover:underline">Edit</Link>
                    <ConfirmButton label="Delete" confirmTitle="Delete this article?" confirmDescription={`"${row.title}" will be permanently removed.`} onConfirm={() => handleDelete(row)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
