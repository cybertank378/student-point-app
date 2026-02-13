//Files : src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/modules/shared/core/jwt";
import { getPermissions } from "@/modules/auth/domain/rbac/rolePermissionPolicy";
import { evaluatePolicy } from "@/modules/auth/domain/rbac/policyEngine";
import { UserRole } from "@/libs/utils";

interface JwtPayload {
    sub: string;
    role: UserRole;
    teacherRole?: string;
}

function isJwtPayload(payload: unknown): payload is JwtPayload {
    if (typeof payload !== "object" || payload === null) return false;

    const record = payload as Record<string, unknown>;

    return (
        typeof record.sub === "string" &&
        typeof record.role === "string"
    );
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow public auth routes only
    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/api/auth")
    ) {
        return NextResponse.next();
    }

    const accessCookie = req.cookies.get("accessToken");

    if (!accessCookie?.value) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    let user: JwtPayload;

    try {
        const decoded = await verifyAccessToken(accessCookie.value);

        if (!isJwtPayload(decoded)) {
            throw new Error();
        }

        user = decoded;
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const permissions = getPermissions(
        user.role,
        user.teacherRole as any
    );

    const allowed = evaluatePolicy({
        path: pathname,
        method: req.method,
        permissions,
    });

    if (!allowed) {
        return NextResponse.redirect(new URL("/403", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
