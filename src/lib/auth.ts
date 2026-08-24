import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { AuthSessionPayload, UserProfile } from "../types/auth";

export const AUTH_COOKIE_NAME = "dk_user_session";
export const ADMIN_COOKIE_NAME = "admin_session";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "vattudongkha_jwt_secret_key_2026_secure_random";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session Token Generation
export async function createSessionToken(payload: AuthSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

// Session Token Verification
export async function verifySessionToken(token: string): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as "CUSTOMER" | "ADMIN") || "CUSTOMER",
    };
  } catch {
    return null;
  }
}

// Set Session Cookie
export async function setAuthCookie(payload: AuthSessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  // If Admin, also set admin_session for admin portal
  if (payload.role === "ADMIN") {
    cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
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

// Get Current User from Request Cookies
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

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

    return user;
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
