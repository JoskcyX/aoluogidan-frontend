import { jwtVerify } from "jose";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "EDITOR";
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set. It must match the backend's JWT_SECRET exactly.");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Verifies a session JWT (issued by the backend at login) and returns the
 * embedded user claims. Used in middleware (edge runtime) and in Server
 * Components, so this only checks the signature/expiry locally — it never
 * calls the backend. That's enough for read-only route protection; any
 * privileged write still gets checked again by the backend itself.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.id || !payload.email || !payload.role) return null;
    return {
      id: payload.id as string,
      name: (payload.name as string) ?? "",
      email: payload.email as string,
      role: payload.role as "SUPER_ADMIN" | "EDITOR",
    };
  } catch {
    return null;
  }
}
