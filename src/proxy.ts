
import { NextRequest, NextResponse } from "next/server";
import {
    verifyAccessToken,
    verifyRefreshToken,
    generateAccessToken,
} from "@/modules/shared/core/jwt";

import { evaluatePolicy } from "@/modules/auth/domain/rbac/policyEngine";

import {
    UserRole,
    TeacherRole,
    ONE_DAY,
    USER_ROLES,
    TEACHER_ROLES,
    mapToAuthPayload,
    ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE
} from "@/libs/utils";
import {canAccessRoute} from "@/modules/auth/domain/rbac/fieldGuard";
import {AuthPayload} from "@/modules/auth/domain/entity/AuthPayload";

/* ============================================================
   JWT PAYLOAD
============================================================ */


function isJwtPayload(payload: unknown): payload is AuthPayload {
    if (typeof payload !== "object" || payload === null) return false;

    const record = payload as Record<string, unknown>;

    const isValidRole =
        typeof record.role === "string" &&
        USER_ROLES.includes(record.role as UserRole);

    const isValidTeacherRole =
        record.teacherRole === undefined ||
        (
            typeof record.teacherRole === "string" &&
            TEACHER_ROLES.includes(record.teacherRole as TeacherRole)
        );

    return (
        typeof record.sub === "string" &&
        typeof record.username === "string" &&
        isValidRole &&
        isValidTeacherRole
    );
}

/* ============================================================
   ROUTE HELPERS
============================================================ */

function isPublicRoute(path: string) {
    return (
        path.startsWith("/login") ||
        path.startsWith("/403") ||
        path.startsWith("/api/auth") ||
        path.startsWith("/_next") ||
        path.startsWith("/favicon")
    );
}

/* ============================================================
   PROXY
============================================================ */

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;

    let user: AuthPayload | null = null;
    let response: NextResponse | null = null;

    /* =============================
       VERIFY ACCESS TOKEN
    ============================= */

    if (accessToken) {
        try {
            const decoded = await verifyAccessToken(accessToken);

            if (isJwtPayload(decoded)) {
                user = mapToAuthPayload(decoded);
            }
        } catch {
            user = null;
        }
    }


    /* =============================
       AUTO REFRESH
    ============================= */

    if (!user && refreshToken) {
        try {
            const decoded = await verifyRefreshToken(refreshToken);

            if (!isJwtPayload(decoded)) {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            const payload = mapToAuthPayload(decoded);

            const newAccessToken = await generateAccessToken(payload);

            response = NextResponse.next();

            // ✅ Extend access token
            response.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: ACCESS_TOKEN_EXPIRE, // 15 menit
            });

            // ✅ IMPORTANT: Extend refresh token (SLIDING SESSION)
            response.cookies.set("refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: REFRESH_TOKEN_EXPIRE, // 1 hari idle timeout
            });

            user = payload;

        } catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }


    if (!user) {
        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }

    /* ============================================================
       DASHBOARD ROUTE GUARD
    ============================================================ */

    if (pathname.startsWith("/dashboard")) {
        const allowed = canAccessRoute(user.role, pathname);

        if (!allowed) {
            return NextResponse.redirect(
                new URL("/403", req.url)
            );
        }

        return NextResponse.next();
    }

    /* ============================================================
       API RBAC POLICY ENGINE
    ============================================================ */

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

    return NextResponse.next();
}

/* ============================================================
   APPLY PROXY
============================================================ */

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
