import { NextRequest } from "next/server";
import { cookies } from "next/headers";

/**
 * Base URL of the standalone backend API (deployed separately, e.g. on
 * Render). Server-only — never exposed to the browser. Every fetch in this
 * app, whether from a Server Component or from one of our own /api/*
 * route handlers, goes to this backend. The browser never talks to the
 * backend directly.
 */
const API_URL = (process.env.API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export const SESSION_COOKIE = "session";

/** Small helper: throws with a readable message on non-OK responses. */
async function toJson(res: Response) {
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!res.ok) {
    const message = body?.error ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return body;
}

/* --------------------------------------------------------------------- */
/*  Public, unauthenticated reads — used by Server Components in         */
/*  app/(public)/**. These hit read-only endpoints on the backend that    */
/*  don't require a session.                                             */
/* --------------------------------------------------------------------- */

async function publicGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  return toJson(res);
}

export const api = {
  getSiteSettings: () => publicGet("/api/public/settings"),
  getPracticeAreas: () => publicGet("/api/public/practice-areas"),
  getPracticeArea: (slug: string) => publicGet(`/api/public/practice-areas/${encodeURIComponent(slug)}`),
  getLawyers: () => publicGet("/api/public/lawyers"),
  getLawyer: (slug: string) => publicGet(`/api/public/lawyers/${encodeURIComponent(slug)}`),
  getFeaturedLawyers: () => publicGet("/api/public/lawyers?featuredHome=true"),
  getBlogPosts: (params?: { page?: number; category?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.category) qs.set("category", params.category);
    if (params?.limit) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return publicGet(`/api/public/blog${suffix}`);
  },
  getBlogPost: (slug: string) => publicGet(`/api/public/blog/${encodeURIComponent(slug)}`),
  getBlogCategories: () => publicGet("/api/public/blog-categories"),
  getFaqs: () => publicGet("/api/public/faqs"),
  getTestimonials: (params?: { featured?: boolean }) =>
    publicGet(`/api/public/testimonials${params?.featured ? "?featured=true" : ""}`),
  getAboutContent: () => publicGet("/api/public/about"),
  getPageBySlug: (slug: string) => publicGet(`/api/public/pages/${encodeURIComponent(slug)}`),
  getSitemapData: () => publicGet("/api/public/sitemap-data"),
};

/* --------------------------------------------------------------------- */
/*  Authenticated admin reads — used by Server Components under          */
/*  app/admin/(protected)/**. Forwards the session cookie as a Bearer     */
/*  token so the backend can authorize the request.                      */
/* --------------------------------------------------------------------- */

export async function adminFetchJson(path: string, init: RequestInit = {}) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
  return toJson(res);
}

/* --------------------------------------------------------------------- */
/*  Generic proxy for our own /api/* route handlers. Client components   */
/*  ('use client' forms and tables) keep fetching our own /api/* paths    */
/*  exactly as before — these handlers just forward the request on to    */
/*  the backend, attaching the session cookie as a Bearer token.         */
/* --------------------------------------------------------------------- */

export async function proxyToBackend(req: NextRequest, backendPath: string): Promise<Response> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const init: RequestInit = { method: req.method, headers };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      // Let fetch set its own multipart boundary header.
      init.body = await req.formData();
    } else {
      headers["Content-Type"] = contentType || "application/json";
      init.body = await req.text();
    }
  }

  const url = `${API_URL}${backendPath}${req.nextUrl.search}`;
  const res = await fetch(url, init);
  const body = await res.arrayBuffer();
  return new Response(body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}

export { API_URL };
