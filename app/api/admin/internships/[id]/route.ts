import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api";

// Thin proxy: the real logic (database, validation, auth) is expected to
// live in the standalone backend. This just forwards the request there,
// attaching the admin session cookie as a Bearer token.
//
// Expected backend endpoints:
//   GET    /api/admin/internships/:id
//   PATCH  /api/admin/internships/:id   (e.g. { status: "REVIEWED" })
//   DELETE /api/admin/internships/:id

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyToBackend(req, `/api/admin/internships/${params.id}`);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyToBackend(req, `/api/admin/internships/${params.id}`);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyToBackend(req, `/api/admin/internships/${params.id}`);
}
