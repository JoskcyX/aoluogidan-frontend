"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import type { Lawyer } from "@/lib/types";

export function LawyersTable({ initialLawyers }: { initialLawyers: Lawyer[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialLawyers);

  const togglePublished = async (lawyer: Lawyer) => {
    const nextValue = !lawyer.published;
    setRows((prev) => prev.map((r) => (r.id === lawyer.id ? { ...r, published: nextValue } : r)));

    const res = await fetch(`/api/admin/lawyers/${lawyer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: nextValue }),
    });

    if (!res.ok) {
      setRows((prev) => prev.map((r) => (r.id === lawyer.id ? { ...r, published: lawyer.published } : r)));
      toast.error("Couldn't update publish status.");
    } else {
      toast.success(nextValue ? "Lawyer published." : "Lawyer unpublished.");
    }
  };

  const handleDelete = async (lawyer: Lawyer) => {
    const res = await fetch(`/api/admin/lawyers/${lawyer.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Couldn't delete lawyer.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== lawyer.id));
    toast.success("Lawyer deleted.");
    router.refresh();
  };

  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate">
          <tr>
            <th className="px-5 py-3">Photo</th>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Position</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((lawyer) => (
            <tr key={lawyer.id}>
              <td className="px-5 py-3">
                <div className="h-10 w-10 overflow-hidden rounded-sm bg-surface">
                  {lawyer.photoUrl && (
                    <Image src={lawyer.photoUrl} alt="" width={40} height={40} className="h-full w-full object-cover" />
                  )}
                </div>
              </td>
              <td className="px-5 py-3 font-medium text-ink">{lawyer.name}</td>
              <td className="px-5 py-3 text-slate">{lawyer.position}</td>
              <td className="px-5 py-3">
                <button onClick={() => togglePublished(lawyer)}>
                  <Badge variant={lawyer.published ? "success" : "neutral"}>
                    {lawyer.published ? "Published" : "Draft"}
                  </Badge>
                </button>
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-4">
                  <Link href={`/admin/lawyers/${lawyer.id}`} className="text-sm text-brass-deep hover:underline">
                    Edit
                  </Link>
                  <ConfirmButton
                    label="Delete"
                    confirmTitle="Delete this lawyer profile?"
                    confirmDescription={`"${lawyer.name}" will be permanently removed from the website. This can't be undone.`}
                    onConfirm={() => handleDelete(lawyer)}
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
