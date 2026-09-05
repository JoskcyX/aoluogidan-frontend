import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api";

// Thin proxy: the real logic (database, validation, auth) now lives
// in the standalone backend. This just forwards the request there,
// attaching the admin session cookie as a Bearer token.

export async function GET(req: NextRequest) {
  return proxyToBackend(req, "/api/admin/practice-areas");
}

export async function POST(req: NextRequest) {
  return proxyToBackend(req, "/api/admin/practice-areas");
}
