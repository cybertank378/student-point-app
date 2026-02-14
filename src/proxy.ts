//Files: src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import {
    verifyAccessToken,
    verifyRefreshToken,
    generateAccessToken,
} from "@/modules/shared/core/jwt";

import { evaluatePolicy } from "@/modules/auth/domain/rbac/policyEngine";
import { canAccessRoute } from "@/modules/auth/domain/rbac/fieldGuard";

import {
    USER_ROLES,
    TEACHER_ROLES,
    mapToAuthPayload,
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE,
    UserRole,
    TeacherRole, ONE_DAY, SEVEN_DAYS,
} from "@/libs/utils";

import prisma from "@/libs/prisma";
import { AuthPayload } from "@/modules/auth/domain/entity/AuthPayload";
import {BcryptService} from "@/modules/auth/application/service/BcryptService";

/* ============================================================
   HASH SERVICE
============================================================ */

const hashService = new BcryptService();

/* ============================================================
   TYPE GUARD
============================================================ */

function isJwtPayload(payload: unknown): payload is AuthPayload {

    if (typeof payload !== "object" || payload === null) {
        return false;
    }

    const record = payload as Record<string, unknown>;

    const validRole =
        typeof record.role === "string" &&
        USER_ROLES.includes(record.role as UserRole);

    const validTeacherRole =
        record.teacherRole === undefined ||
        (
            typeof record.teacherRole === "string" &&
            TEACHER_ROLES.includes(record.teacherRole as TeacherRole)
        );

    return (
        typeof record.sub === "string" &&
        typeof record.username === "string" &&
        validRole &&
        validTeacherRole
    );
}

/* ============================================================
   PUBLIC ROUTE CHECK
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

    const accessToken =
        req.cookies.get("accessToken")?.value;

    console.log("ACCESS TOKEN:", accessToken);

    const refreshToken =
        req.cookies.get("refreshToken")?.value;

    let user: AuthPayload | null = null;

    const response = NextResponse.next();

    /* ================= ACCESS TOKEN ================= */

    if (accessToken) {

        const decoded =
            await verifyAccessToken(accessToken);

        if (isJwtPayload(decoded)) {
            user = mapToAuthPayload(decoded);
        }
    }

    /* ================= AUTO REFRESH ================= */

    if (!user && refreshToken) {

        const decoded =
            await verifyRefreshToken(refreshToken);

        if (!isJwtPayload(decoded)) {
            return NextResponse.redirect(
                new URL("/login", req.url)
            );
        }

        /* ===== Validate refresh token in DB ===== */

        const sessions =
            await prisma.authSession.findMany({
                where: {
                    userId: decoded.sub,
                    revoked: false,
                    expiresAt: { gt: new Date() },
                },
            });

        let validSession = false;

        for (const session of sessions) {

            const match =
                await hashService.compare(
                    refreshToken,
                    session.tokenHash
                );

            if (match) {
                validSession = true;
                break;
            }
        }

        if (!validSession) {
            return NextResponse.redirect(
                new URL("/login", req.url)
            );
        }

        /* ===== Generate new access token ===== */

        const payload =
            mapToAuthPayload(decoded);

        const newAccessToken =
            await generateAccessToken(payload);

        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: ONE_DAY,
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: SEVEN_DAYS,
        });

        user = payload;
    }

    if (!user) {
        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }

    /* ================= DASHBOARD GUARD ================= */

    if (pathname.startsWith("/dashboard")) {

        const allowed =
            canAccessRoute(user.role, pathname);

        if (!allowed) {
            return NextResponse.redirect(
                new URL("/403", req.url)
            );
        }

        return response;
    }

    /* ================= API POLICY ================= */

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

    return response;
}

/* ============================================================
   MATCHER
============================================================ */

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
