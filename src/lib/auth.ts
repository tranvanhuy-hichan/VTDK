import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { AuthSessionPayload, UserProfile } from "../types/auth";

export const AUTH_COOKIE_NAME = "dk_user_session";
export const ADMIN_COOKIE_NAME = "admin_session";

// 90 Days Session Lifetime (in seconds): 90 * 24 * 60 * 60 = 7,776,000s
export const SESSION_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

// 8 Hours Key / Token Refresh Interval (in seconds): 8 * 60 * 60 = 28,800s
export const TOKEN_REFRESH_INTERVAL_SECONDS = 8 * 60 * 60;

const JWT_SECRET_STRING = process.env.JWT_SECRET || "vattudongkha_jwt_secret_key_2026_secure_random";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session Token Generation with 90-day validity and 8-hour refresh tracking
export async function createSessionToken(
  payload: AuthSessionPayload,
  existingSessionExpiresAt?: number
): Promise<string> {
  const now = Date.now();
  const sessionExpiresAt = existingSessionExpiresAt || (now + SESSION_MAX_AGE_SECONDS * 1000);

  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    sessionExpiresAt,
    issuedAt: now,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(Math.floor(now / 1000))
    .setExpirationTime(Math.floor(sessionExpiresAt / 1000))
    .sign(JWT_SECRET);
}

// Session Token Verification with Automatic 8-Hour Refresh detection
export async function verifySessionToken(token: string): Promise<{
  payload: AuthSessionPayload | null;
  needsRefresh: boolean;
  sessionExpiresAt?: number;
}> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const now = Date.now();
    const sessionExpiresAt = (payload.sessionExpiresAt as number) || (now + SESSION_MAX_AGE_SECONDS * 1000);

    // Check if absolute 90-day session has expired
    if (now > sessionExpiresAt) {
      return { payload: null, needsRefresh: false };
    }

    const issuedAt = (payload.issuedAt as number) || (payload.iat ? (payload.iat as number) * 1000 : now);
    const ageInSeconds = (now - issuedAt) / 1000;

    // Needs refresh if token age is >= 8 hours
    const needsRefresh = ageInSeconds >= TOKEN_REFRESH_INTERVAL_SECONDS;

    return {
      payload: {
        userId: payload.userId as string,
        email: payload.email as string,
        name: payload.name as string,
        role: (payload.role as "CUSTOMER" | "ADMIN") || "CUSTOMER",
      },
      needsRefresh,
      sessionExpiresAt,
    };
  } catch {
    return { payload: null, needsRefresh: false };
  }
}

// Set Session Cookie (90 Days Persistent Session)
export async function setAuthCookie(payload: AuthSessionPayload, existingSessionExpiresAt?: number) {
  const token = await createSessionToken(payload, existingSessionExpiresAt);
  const cookieStore = await cookies();
  
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS, // 90 days = 7,776,000s
    path: "/",
  });

  // If Admin, also set admin_session for admin portal
  if (payload.role === "ADMIN") {
    cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS, // 90 days
      path: "/",
    });
  }
}

// Clear Session Cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

// Get Current User with Silent 8-Hour Token Key Rotation & Resilient DB Fallback
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload, needsRefresh, sessionExpiresAt } = await verifySessionToken(token);
    if (!payload?.userId) return null;

    // Automatic silent 8-hour token key rotation
    if (needsRefresh) {
      try {
        await setAuthCookie(payload, sessionExpiresAt);
      } catch {
        // In read-only Server Component render passes, cookie set will happen on next Action
      }
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          address: true,
          role: true,
          avatar: true,
        },
      });

      if (user) return user;
    } catch (dbErr) {
      console.warn("getCurrentUser DB query failed, using verified JWT payload:", dbErr);
    }

    // Fallback to verified JWT payload to prevent session drops
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      phone: null,
      address: null,
      role: payload.role,
      avatar: null,
    };
  } catch {
    return null;
  }
}

// Check Admin Access
export async function getCurrentAdmin(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (user && user.role === "ADMIN") {
    return user;
  }
  return null;
}
