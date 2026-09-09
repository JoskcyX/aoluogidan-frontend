import { NextResponse } from "next/server";
import { adminFetchJson } from "@/lib/api";

// Builds the CSV on this side of the proxy so the backend only needs to
// expose the same GET /api/admin/internships list endpoint used by the
// dashboard table — no dedicated CSV/export endpoint required on the backend.

const COLUMNS: { key: string; label: string }[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "fileCount", label: "Files Attached" },
  { key: "createdAt", label: "Submitted At" },
];

function csvEscape(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  let applications: any[] = [];
  try {
    const data = await adminFetchJson("/api/admin/internships");
    applications = data.applications ?? [];
  } catch {
    // Backend not reachable / not built yet — export an empty template
    // instead of failing outright.
    applications = [];
  }

  const header = COLUMNS.map((c) => csvEscape(c.label)).join(",");
  const rows = applications.map((row) =>
    COLUMNS.map((c) =>
      csvEscape(c.key === "fileCount" ? (Array.isArray(row.files) ? row.files.length : 0) : row[c.key])
    ).join(",")
  );
  const csv = [header, ...rows].join("\r\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="internship-applicants-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
