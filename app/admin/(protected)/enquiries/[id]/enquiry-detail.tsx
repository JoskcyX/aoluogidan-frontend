"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Select } from "@/components/ui/input";
import { ConfirmButton } from "@/components/admin/confirm-button";
import type { Enquiry } from "@/lib/types";

const STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "RESOLVED", "ARCHIVED"] as const;

export function EnquiryDetail({ enquiry }: { enquiry: Enquiry }) {
  const router = useRouter();
  const [status, setStatus] = useState(enquiry.status);
  const [saving, setSaving] = useState(false);

  const updateStatus = async (next: (typeof STATUSES)[number]) => {
    setSaving(true);
    const res = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
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
    const res = await fetch(`/api/admin/enquiries/${enquiry.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Couldn't delete enquiry.");
      return;
    }
    toast.success("Enquiry deleted.");
    router.push("/admin/enquiries");
    router.refresh();
  };

  return (
    <div>
      <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm text-slate hover:text-ink">
        <ArrowLeft size={14} /> Back to Enquiries
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4 border border-line bg-white p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
            {enquiry.type === "CONSULTATION" ? "Consultation Request" : "Contact Enquiry"}
          </p>
          <h1 className="mt-1 font-display text-2xl text-ink">{enquiry.fullName}</h1>
          <p className="mt-1 text-sm text-slate">
            Submitted {new Date(enquiry.createdAt).toLocaleString()}
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
          <dd className="mt-1"><a href={`mailto:${enquiry.email}`} className="text-brass-deep hover:underline">{enquiry.email}</a></dd>
        </div>
        {enquiry.phone && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">Phone</dt>
            <dd className="mt-1">{enquiry.phone}</dd>
          </div>
        )}
        {enquiry.subject && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">Subject</dt>
            <dd className="mt-1">{enquiry.subject}</dd>
          </div>
        )}
        {enquiry.areaOfLaw && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">Area of Law</dt>
            <dd className="mt-1">{enquiry.areaOfLaw}</dd>
          </div>
        )}
        {enquiry.preferredContactMethod && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">Preferred Contact Method</dt>
            <dd className="mt-1">{enquiry.preferredContactMethod}</dd>
          </div>
        )}
        {enquiry.preferredDate && (
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate">Preferred Date</dt>
            <dd className="mt-1">{new Date(enquiry.preferredDate).toLocaleDateString()} {enquiry.preferredTime}</dd>
          </div>
        )}
      </dl>

      <div className="mt-6 border border-line bg-white p-6">
        <dt className="text-xs uppercase tracking-wide text-slate">Message</dt>
        <dd className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">{enquiry.message}</dd>
      </div>

      <div className="mt-6 flex justify-end">
        <ConfirmButton
          label="Delete Enquiry"
          confirmTitle="Delete this enquiry?"
          confirmDescription="This will permanently remove the enquiry record. This can't be undone."
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
