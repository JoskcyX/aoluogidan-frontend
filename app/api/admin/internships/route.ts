import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api";

// Thin proxy: the real logic (database, validation, auth) is expected to
// live in the standalone backend. This just forwards the request there,
// attaching the admin session cookie as a Bearer token.
//
// Expected backend endpoint: GET /api/admin/internships
// Supports an optional ?status= query param (e.g. ?status=NEW) so the
// unread-count route below can reuse it instead of needing a separate
// backend endpoint.

export async function GET(req: NextRequest) {
  return proxyToBackend(req, "/api/admin/internships");
}
