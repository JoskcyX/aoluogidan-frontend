import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api";

// Thin proxy: the real logic (database, validation, auth) now lives
// in the standalone backend. This just forwards the request there,
// attaching the admin session cookie as a Bearer token.

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyToBackend(req, `/api/admin/media/${params.id}`);
}
