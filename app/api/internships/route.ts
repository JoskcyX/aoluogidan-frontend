import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api";

// Thin proxy: forwards the multipart form submission (fields + résumé file)
// to the standalone backend, which is expected to expose
// POST /api/public/internships and handle storage/validation/notifications.

export async function POST(req: NextRequest) {
  return proxyToBackend(req, "/api/public/internships");
}
