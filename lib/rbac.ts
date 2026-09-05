import { cookies } from "next/headers";
import { verifySessionToken, type SessionUser } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/api";

export type { SessionUser };

/** Returns the logged-in admin user, or null if not authenticated. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * For use at the top of Server Components under /admin. Throws so the
 * caller can redirect. Route-level protection also happens in
 * middleware.ts — this is the defense-in-depth second check, since
 * middleware alone can be misconfigured or bypassed. The backend itself
 * checks auth again on every request regardless of what the frontend does.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}

export async function requireSuperAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") {
    throw new ForbiddenError();
  }
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("You must be signed in to do that.");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("You don't have permission to do that.");
    this.name = "ForbiddenError";
  }
}

/** Helper for API route handlers: returns a Response for auth failures, or null if OK. */
export function authErrorResponse(err: unknown): Response | null {
  if (err instanceof UnauthorizedError) {
    return Response.json({ error: err.message }, { status: 401 });
  }
  if (err instanceof ForbiddenError) {
    return Response.json({ error: err.message }, { status: 403 });
  }
  return null;
}
