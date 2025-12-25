import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { getToken } from "next-auth/jwt";

const ADMIN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const AFFILATOR_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyJWT(token, secret) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) &&
    !pathname.startsWith("/api/admin/login") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/admin/banner")
  ) {
    console.log("Admin middleware triggered for path:", pathname);
    const token = request.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyJWT(token, ADMIN_SECRET);

    if (!payload?.isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-email", payload.email || "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // User

  if (
    (pathname.startsWith("/api/user") || pathname.startsWith("/api/payment")) &&
    !pathname.startsWith("/api/user/login") &&
    !pathname.startsWith("/api/user/products") &&
    !pathname.startsWith("/api/user/getCategories") &&
    !pathname.startsWith("/api/user/getBanners") &&
    !pathname.startsWith("/api/user/getProducts")
  ) {
    const internalReqsecret = request.headers.get("x-internal-secret");
    if (internalReqsecret === process.env.INTERNAL_API_SECRET) {
      return NextResponse.next();
    }

    let userEmail = "";

    // 1. JWT check
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = await verifyJWT(token, AFFILATOR_SECRET);
      if (payload) {
        userEmail = payload.email;
      }
    }

    // 2. NextAuth check
    if (!userEmail) {
      const sessionToken = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
      });
      if (sessionToken) {
        userEmail = sessionToken.email;
      } else {
        console.log("No valid session found in NextAuth by middleware");
      }
    }

    // 3. Final decision
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized by middleWare" },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-email", userEmail);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/affilator/:path*",
    "/api/affilator/:path*",
    "/user/:path*",
    "/api/user/:path*",
  ],
};
