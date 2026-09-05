"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import type { PracticeArea } from "@/lib/types";

export function PracticeAreasTable({ initialRows }: { initialRows: PracticeArea[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);

  const togglePublished = async (row: PracticeArea) => {
    const next = !row.published;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: next } : r)));
    const res = await fetch(`/api/admin/practice-areas/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
    if (!res.ok) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: row.published } : r)));
      toast.error("Couldn't update publish status.");
    } else {
      toast.success(next ? "Published." : "Unpublished.");
    }
  };

  const handleDelete = async (row: PracticeArea) => {
    const res = await fetch(`/api/admin/practice-areas/${row.id}`, { method: "DELETE" });
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
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Description</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-3 font-medium text-ink">{row.name}</td>
              <td className="max-w-sm truncate px-5 py-3 text-slate">{row.shortDescription}</td>
              <td className="px-5 py-3">
                <button onClick={() => togglePublished(row)}>
                  <Badge variant={row.published ? "success" : "neutral"}>{row.published ? "Published" : "Draft"}</Badge>
                </button>
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-4">
                  <Link href={`/admin/practice-areas/${row.id}`} className="text-sm text-brass-deep hover:underline">Edit</Link>
                  <ConfirmButton
                    label="Delete"
                    confirmTitle="Delete this practice area?"
                    confirmDescription={`"${row.name}" will be permanently removed. This can't be undone.`}
                    onConfirm={() => handleDelete(row)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
