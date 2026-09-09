"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/confirm-button";
import type { InternshipApplication } from "@/lib/types";

const STATUSES = ["NEW", "REVIEWED", "SHORTLISTED", "REJECTED", "ACCEPTED"] as const;

export function InternshipDetail({ application }: { application: InternshipApplication }) {
  const router = useRouter();
  const [status, setStatus] = useState(application.status ?? "NEW");
  const [saving, setSaving] = useState(false);

  const updateStatus = async (next: (typeof STATUSES)[number]) => {
    setSaving(true);
    const res = await fetch(`/api/admin/internships/${application.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Couldn't update status.");
      return;
    }
    setStatus(next);
    toast.success("Status updated.");
    router.refresh();
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/admin/internships/${application.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Couldn't delete application.");
      return;
    }
    toast.success("Application deleted.");
    router.push("/admin/internships");
    router.refresh();
  };

  return (
    <div>
      <Link href="/admin/internships" className="flex items-center gap-1 text-sm text-slate hover:text-ink">
        <ArrowLeft size={14} /> Back to Internship Applications
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4 border border-line bg-white p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">Internship Application</p>
          <h1 className="mt-1 font-display text-2xl text-ink">{application.firstName} {application.lastName}</h1>
          <p className="mt-1 text-sm text-slate">
            Submitted {application.createdAt ? new Date(application.createdAt).toLocaleString() : "\u2014"}
          </p>
        </div>
        <div className="w-48">
          <Select value={status} disabled={saving} onChange={(e) => updateStatus(e.target.value as (typeof STATUSES)[number])}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </Select>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-4 border border-line bg-white p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate">Email</dt>
          <dd className="mt-1">
            <a href={`mailto:${application.email}`} className="text-brass-deep hover:underline">{application.email}</a>
          </dd>
        </div>
        {application.phone && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">Phone</dt>
            <dd className="mt-1">{application.phone}</dd>
          </div>
        )}
      </dl>

      {Array.isArray(application.files) && application.files.length > 0 && (
        <div className="mt-6 border border-line bg-white p-6">
          <dt className="text-xs uppercase tracking-wide text-slate">Attached Files</dt>
          <ul className="mt-3 space-y-2">
            {application.files.map((file: any, i: number) => (
              <li key={file.url ?? i} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm">
                <span className="truncate text-ink">{file.name ?? `File ${i + 1}`}</span>
                {file.url && (
                  <a href={file.url} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="secondary">
                      <Download size={14} className="mr-1" /> Download
                    </Button>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <ConfirmButton
          label="Delete Application"
          confirmTitle="Delete this application?"
          confirmDescription="This will permanently remove the applicant's record. This can't be undone."
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
