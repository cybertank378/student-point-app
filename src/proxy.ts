// Files: src/proxy.ts

import { type NextRequest, NextResponse } from "next/server";
import type AuthPayload from "@/modules/auth/domain/entity/AuthPayload";
import { verifyAccessToken } from "@/modules/shared/core/jwt";
import { canAccessRoute } from "@/security/fieldGuard";
import { evaluatePolicy } from "@/security/policyEngine";

/* ============================================================
 PUBLIC ROUTE
 ============================================================ */

function isPublicRoute(path: string) {
  // static files
  if (
      path.startsWith("/_next") ||
      path.startsWith("/assets") ||
      path.startsWith("/pdf.worker") ||
      path === "/favicon.ico"
  ) {
    return true;
  }

  // auth routes
  return path.startsWith ("/login") ||
      path.startsWith ("/api/auth");


}

/* ============================================================
 PROXY
 ============================================================ */

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("PROXY HIT:", pathname);

  if (isPublicRoute(pathname)) {
    console.log("PUBLIC BYPASS:", pathname);
    return NextResponse.next();
  }

  console.log("PROTECTED:", pathname);

  /* ================= TOKEN ================= */

  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, req.url)
    );
  }

  /* ================= VERIFY TOKEN ================= */

  const decoded = await verifyAccessToken(accessToken);

  /* ================= TOKEN EXPIRED ================= */

  if (!decoded) {
    console.log("[JWT] Access token expired");

    const res = NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, req.url)
    );

    res.cookies.delete("accessToken");

    return res;
  }

  const user = decoded as AuthPayload;

  /* ================= DASHBOARD ================= */

  if (pathname.startsWith("/dashboard")) {
    const allowed = canAccessRoute(user.role, pathname);

    if (!allowed) {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  /* ================= API ================= */

  if (pathname.startsWith("/api")) {
    const allowed = evaluatePolicy({
      path: pathname,
      method: req.method,
      role: user.role,
    });

    if (!allowed) {
      return NextResponse.json(
          { message: "Forbidden" },
          { status: 403 }
      );
    }
  }

  /* ================= ALLOW ================= */

  return NextResponse.next();
}

/* ============================================================
 MATCHER
 ============================================================ */

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*, "],
};