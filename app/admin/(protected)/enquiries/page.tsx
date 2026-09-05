import Link from "next/link";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

const STATUS_VARIANT: Record<string, "warning" | "success" | "neutral" | "default"> = {
  NEW: "warning",
  CONTACTED: "default",
  IN_PROGRESS: "default",
  RESOLVED: "success",
  ARCHIVED: "neutral",
};

export default async function AdminEnquiriesPage() {
  const { enquiries: rows = [] } = await adminFetchJson("/api/admin/enquiries");

  return (
    <Container className="max-w-none px-0">
      <h1 className="font-display text-2xl text-ink">Enquiries</h1>
      <p className="mt-1 text-sm text-slate">Contact form submissions and consultation requests from your website.</p>

      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState title="No enquiries yet." description="Submissions from the Contact and Consultation forms will appear here." />
        ) : (
          <div className="overflow-x-auto border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Area of Law</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((e: any) => (
                  <tr key={e.id}>
                    <td className="px-5 py-3">
                      <Link href={`/admin/enquiries/${e.id}`} className="font-medium text-ink hover:text-brass-deep">
                        {e.fullName}
                      </Link>
                      <p className="text-xs text-slate">{e.email}</p>
                    </td>
                    <td className="px-5 py-3 text-slate">{e.type === "CONSULTATION" ? "Consultation" : "Contact"}</td>
                    <td className="px-5 py-3 text-slate">{e.areaOfLaw ?? "\u2014"}</td>
                    <td className="px-5 py-3 text-slate">{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <Badge variant={STATUS_VARIANT[e.status]}>{e.status.replace("_", " ")}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}
