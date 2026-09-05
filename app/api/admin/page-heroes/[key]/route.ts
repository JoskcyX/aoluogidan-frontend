import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api";

export async function PATCH(req: NextRequest, { params }: { params: { key: string } }) {
  return proxyToBackend(req, `/api/admin/page-heroes/${encodeURIComponent(params.key)}`);
}
