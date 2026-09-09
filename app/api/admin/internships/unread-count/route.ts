import { NextResponse } from "next/server";
import { adminFetchJson } from "@/lib/api";

// Powers the "new applicants" badge/notification in the admin sidebar.
// Reuses the main list endpoint with a status filter rather than requiring
// a dedicated backend route — the backend just needs
// GET /api/admin/internships?status=NEW to return { applications: [...] }.

export async function GET() {
  try {
    const { applications = [] } = await adminFetchJson("/api/admin/internships?status=NEW");
    return NextResponse.json({ count: applications.length });
  } catch {
    // Backend not reachable yet / not built — fail quietly so the sidebar
    // doesn't spam errors while the internship backend is in progress.
    return NextResponse.json({ count: 0 });
  }
}
