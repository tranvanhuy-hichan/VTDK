import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "dk_user_session";
const JWT_SECRET_STRING = process.env.JWT_SECRET || "vattudongkha_jwt_secret_key_2026_secure_random";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

interface JWTPayload {
  userId?: string;
  email?: string;
  role?: string;
  sessionExpiresAt?: number;
}

async function verifyEdgeToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const now = Date.now();
    const sessionExpiresAt = payload.sessionExpiresAt as number | undefined;

    if (sessionExpiresAt && now > sessionExpiresAt) {
      return null;
    }

    return {
      userId: payload.userId as string | undefined,
      email: payload.email as string | undefined,
      role: payload.role as string | undefined,
      sessionExpiresAt,
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 1. Guard Admin Portal Routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    // If accessing admin routes, verify admin role
    if (!token) {
      const loginUrl = new URL("/dang-nhap", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyEdgeToken(token);
    if (!payload || payload.role !== "ADMIN") {
      const loginUrl = new URL("/dang-nhap", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard User Portal Routes (/tai-khoan/*)
  if (pathname.startsWith("/tai-khoan")) {
    if (!token) {
      const loginUrl = new URL("/dang-nhap", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyEdgeToken(token);
    if (!payload?.userId) {
      const loginUrl = new URL("/dang-nhap", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/tai-khoan/:path*",
  ],
};
