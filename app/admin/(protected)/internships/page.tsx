import Link from "next/link";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Download } from "lucide-react";

const STATUS_VARIANT: Record<string, "warning" | "success" | "neutral" | "default"> = {
  NEW: "warning",
  REVIEWED: "default",
  SHORTLISTED: "default",
  ACCEPTED: "success",
  REJECTED: "neutral",
};

export default async function AdminInternshipsPage() {
  const { applications: rows = [] } = await adminFetchJson("/api/admin/internships").catch(() => ({
    applications: [],
  }));

  return (
    <Container className="max-w-none px-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Internship Applications</h1>
          <p className="mt-1 text-sm text-slate">Applicants who have applied for an internship through the website.</p>
        </div>
        <a href="/api/admin/internships/export" download>
          <Button variant="secondary" size="sm">
            <Download size={16} className="mr-1" /> Export CSV
          </Button>
        </a>
      </div>

      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState
            title="No applications yet."
            description="Submissions from the Internship Application form will appear here."
          />
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="grid gap-3 md:hidden">
              {rows.map((a: any) => (
                <Link
                  key={a.id}
                  href={`/admin/internships/${a.id}`}
                  className="block border border-line bg-white p-4 hover:border-brass"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{a.firstName} {a.lastName}</p>
                      <p className="truncate text-xs text-slate">{a.email}</p>
                    </div>
                    <Badge variant={STATUS_VARIANT[a.status] ?? "default"}>{(a.status ?? "NEW").replace("_", " ")}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate">
                    {a.phone ?? "\u2014"} ·{" "}
                    {Array.isArray(a.files) ? `${a.files.length} file${a.files.length === 1 ? "" : "s"}` : "0 files"} ·{" "}
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "\u2014"}
                  </p>
                </Link>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto border border-line bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Phone</th>
                    <th className="px-5 py-3">Files</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((a: any) => (
                    <tr key={a.id}>
                      <td className="px-5 py-3">
                        <Link href={`/admin/internships/${a.id}`} className="font-medium text-ink hover:text-brass-deep">
                          {a.firstName} {a.lastName}
                        </Link>
                        <p className="text-xs text-slate">{a.email}</p>
                      </td>
                      <td className="px-5 py-3 text-slate">{a.phone ?? "\u2014"}</td>
                      <td className="px-5 py-3 text-slate">{Array.isArray(a.files) ? a.files.length : 0}</td>
                      <td className="px-5 py-3 text-slate">
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "\u2014"}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={STATUS_VARIANT[a.status] ?? "default"}>{(a.status ?? "NEW").replace("_", " ")}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
