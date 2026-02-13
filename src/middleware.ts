//Files : src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import {
    verifyAccessToken,
    verifyRefreshToken,
    generateAccessToken,
} from "@/modules/shared/core/jwt";

import { getPermissions } from "@/modules/auth/domain/rbac/rolePermissionPolicy";
import { evaluatePolicy } from "@/modules/auth/domain/rbac/policyEngine";
import {UserRole, TeacherRole, ONE_DAY} from "@/libs/utils";

/**
 * =====================================================
 * STRICT JWT PAYLOAD
 * =====================================================
 */
interface JwtPayload {
    sub: string;
    role: UserRole;
    teacherRole?: TeacherRole;
}

/**
 * =====================================================
 * TYPE GUARD
 * =====================================================
 */
function isJwtPayload(payload: unknown): payload is JwtPayload {
    if (typeof payload !== "object" || payload === null) return false;

    const record = payload as Record<string, unknown>;

    return (
        typeof record.sub === "string" &&
        typeof record.role === "string"
    );
}

/**
 * =====================================================
 * ROUTE HELPERS
 * =====================================================
 */
function isPublicRoute(pathname: string): boolean {
    return (
        pathname.startsWith("/login") ||
        pathname.startsWith("/403") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon")
    );
}

function isApiRoute(pathname: string): boolean {
    return pathname.startsWith("/api");
}

function redirectToLogin(req: NextRequest): NextResponse {
    return NextResponse.redirect(new URL("/login", req.url));
}

function redirectToForbidden(req: NextRequest): NextResponse {
    return NextResponse.redirect(new URL("/403", req.url));
}

/**
 * =====================================================
 * GLOBAL AUTH + RBAC MIDDLEWARE
 * =====================================================
 */
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    const accessCookie = req.cookies.get("accessToken");
    const refreshCookie = req.cookies.get("refresh_token");

    let user: JwtPayload | null = null;

    /**
     * =====================================================
     * 1️⃣ VERIFY ACCESS TOKEN
     * =====================================================
     */
    if (accessCookie?.value) {
        try {
            const decoded = await verifyAccessToken(accessCookie.value);

            if (!isJwtPayload(decoded)) {
                throw new Error("Invalid access payload");
            }

            user = {
                sub: decoded.sub,
                role: decoded.role as UserRole,
                teacherRole: decoded.teacherRole as TeacherRole | undefined,
            };
        } catch {
            user = null;
        }
    }

    /**
     * =====================================================
     * 2️⃣ AUTO REFRESH
     * =====================================================
     */
    if (!user && refreshCookie?.value) {
        try {
            const decodedRefresh = await verifyRefreshToken(
                refreshCookie.value
            );

            if (!isJwtPayload(decodedRefresh)) {
                throw new Error("Invalid refresh payload");
            }

            const refreshedUser: JwtPayload = {
                sub: decodedRefresh.sub,
                role: decodedRefresh.role as UserRole,
                teacherRole: decodedRefresh.teacherRole as
                    | TeacherRole
                    | undefined,
            };

            const newAccessToken = await generateAccessToken({
                sub: refreshedUser.sub,
                role: refreshedUser.role,
                teacherRole: refreshedUser.teacherRole,
            });

            const response = NextResponse.next();

            response.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: ONE_DAY,
            });

            user = refreshedUser;

            return response;
        } catch {
            return redirectToLogin(req);
        }
    }

    /**
     * =====================================================
     * 3️⃣ NOT AUTHENTICATED
     * =====================================================
     */
    if (!user) {
        return redirectToLogin(req);
    }

    /**
     * =====================================================
     * 4️⃣ PERMISSION RESOLUTION
     * =====================================================
     */
    const permissions = getPermissions(
        user.role,
        user.teacherRole
    );

    /**
     * =====================================================
     * 5️⃣ POLICY EVALUATION
     * =====================================================
     */
    const allowed = evaluatePolicy({
        path: pathname,
        method: req.method,
        permissions,
    });

    if (!allowed) {
        if (isApiRoute(pathname)) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        return redirectToForbidden(req);
    }

    /**
     * =====================================================
     * 6️⃣ SUCCESS
     * =====================================================
     */
    return NextResponse.next();
}

/**
 * =====================================================
 * APPLY TO DASHBOARD + API
 * =====================================================
 */
export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
