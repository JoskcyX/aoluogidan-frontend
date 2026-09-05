"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/admin/confirm-button";

type Row = { id: string; name: string; email: string; role: "SUPER_ADMIN" | "EDITOR"; isActive: boolean };

export function UsersTable({ initialRows, currentUserId }: { initialRows: Row[]; currentUserId: string }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);

  const handleDelete = async (row: Row) => {
    const res = await fetch(`/api/admin/users/${row.id}`, { method: "DELETE" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(body.error ?? "Couldn't delete.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    toast.success("Admin removed.");
    router.refresh();
  };

  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate">
          <tr>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-3 font-medium text-ink">{row.name} {row.id === currentUserId && <span className="text-xs text-slate">(you)</span>}</td>
              <td className="px-5 py-3 text-slate">{row.email}</td>
              <td className="px-5 py-3"><Badge variant={row.role === "SUPER_ADMIN" ? "default" : "neutral"}>{row.role === "SUPER_ADMIN" ? "Super Admin" : "Editor"}</Badge></td>
              <td className="px-5 py-3"><Badge variant={row.isActive ? "success" : "neutral"}>{row.isActive ? "Active" : "Disabled"}</Badge></td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-4">
                  <Link href={`/admin/users/${row.id}`} className="text-sm text-brass-deep hover:underline">Edit</Link>
                  {row.id !== currentUserId && (
                    <ConfirmButton label="Delete" confirmTitle="Remove this admin?" confirmDescription={`"${row.name}" will lose access immediately.`} onConfirm={() => handleDelete(row)} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
