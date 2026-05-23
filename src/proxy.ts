import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/test", "/select-course", "/plans", "/dashboard"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const testStatus = payload.testStatus as string;
      const paymentStatus = payload.paymentStatus as string;
      const domain = payload.domain as string | null;

      // ── GLOBAL ENROLLMENT CHECK: if completed, always go to dashboard
      if (domain && paymentStatus === "completed" && !pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // ── /test: already passed → go forward
      if (pathname.startsWith("/test")) {
        if (testStatus === "passed") {
          if (domain && paymentStatus === "completed") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          if (domain) {
            return NextResponse.redirect(new URL("/plans", request.url));
          }
          return NextResponse.redirect(new URL("/select-course", request.url));
        }
      }

      // ── /select-course: must have passed test
      if (pathname.startsWith("/select-course")) {
        if (testStatus !== "passed") {
          return NextResponse.redirect(new URL("/test", request.url));
        }
        // Already chosen domain and paid → dashboard
        if (domain && paymentStatus === "completed") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }

      // ── /plans: must have passed and chosen domain
      if (pathname.startsWith("/plans")) {
        if (testStatus !== "passed") {
          return NextResponse.redirect(new URL("/test", request.url));
        }
        if (!domain) {
          return NextResponse.redirect(new URL("/select-course", request.url));
        }
        if (paymentStatus === "completed") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }

      // ── /dashboard: accessible to all authenticated users
      // The dashboard UI handles specific onboarding states.
      if (pathname.startsWith("/dashboard")) {
        // Allow access
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect already-logged-in users away from auth pages to the correct funnel step
  if (token && (pathname === "/login" || pathname === "/register")) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const testStatus = payload.testStatus as string;
      const paymentStatus = payload.paymentStatus as string;
      const domain = payload.domain as string | null;

      if (paymentStatus === "completed") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else if (testStatus === "passed" && domain) {
        return NextResponse.redirect(new URL("/plans", request.url));
      } else if (testStatus === "passed") {
        return NextResponse.redirect(new URL("/select-course", request.url));
      } else {
        return NextResponse.redirect(new URL("/test", request.url));
      }
    } catch {
      // invalid token, let them through
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/test/:path*",
    "/select-course/:path*",
    "/plans/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
