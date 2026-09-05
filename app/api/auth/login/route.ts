import { NextRequest, NextResponse } from "next/server";
import { API_URL, SESSION_COOKIE } from "@/lib/api";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * Thin proxy: forwards credentials to the backend's /api/auth/login, and
 * if that succeeds, stores the JWT it returns as an httpOnly cookie on
 * this app's own domain. The frontend never sees the raw token in JS —
 * only the backend and this route handler do.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { allowed } = rateLimit(`login-proxy:${ip}`, { limit: 20, windowMs: 15 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many sign-in attempts. Please wait a few minutes." }, { status: 429 });
  }

  const body = await req.text();

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.token) {
    return NextResponse.json({ error: data?.error ?? "Incorrect email or password." }, { status: res.status || 401 });
  }

  const response = NextResponse.json({ user: data.user });
  response.cookies.set(SESSION_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60, // 8 hours, matches backend token expiry
  });
  return response;
}
