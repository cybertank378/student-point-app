//Files: src/modules/auth/server/refreshAccessToken.ts
//Files: src/modules/auth/server/refreshAccessToken.ts

import { cookies } from "next/headers";
import prisma from "@/libs/prisma";

import {
    verifyRefreshToken,
    generateAccessToken,
} from "@/modules/shared/core/jwt";

import { AuthPayload } from "@/modules/auth/domain/entity/AuthPayload";
import { serverLog } from "@/libs/serverLogger";
import {ACCESS_TOKEN_EXPIRE, ONE_DAY, SEVEN_DAYS} from "@/libs/utils";
import {BcryptService} from "@/modules/auth/application/service/BcryptService";

export async function refreshAccessToken(): Promise<AuthPayload | null> {

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
        serverLog("Refresh → No refresh token cookie");
        return null;
    }

    const decoded = await verifyRefreshToken(refreshToken);

    if (!decoded || typeof decoded.sub !== "string") {
        serverLog("Refresh → Invalid refresh token");
        return null;
    }

    /* ================= FIND VALID SESSIONS ================= */

    const sessions = await prisma.authSession.findMany({
        where: {
            userId: decoded.sub,
            revoked: false,
            expiresAt: { gt: new Date() },
        },
    });

    if (!sessions.length) {
        serverLog("Refresh → No valid sessions");
        return null;
    }

    const hashService = new BcryptService();

    let matchedSession = null;

    for (const session of sessions) {
        const isMatch = await hashService.compare(
            refreshToken,
            session.tokenHash
        );

        if (isMatch) {
            matchedSession = session;
            break;
        }
    }

    if (!matchedSession) {
        serverLog("Refresh → Refresh token mismatch");
        return null;
    }

    /* ================= FETCH USER ================= */

    const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
    });

    if (!user) {
        serverLog("Refresh → User not found");
        return null;
    }

    /* ================= GENERATE NEW ACCESS TOKEN ================= */

    const payload: AuthPayload = {
        sub: user.id,
        username: user.username,
        role: user.role,
        teacherRole: user.teacherRole ?? undefined,
    };

    const newAccessToken = await generateAccessToken(payload);

    cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ONE_DAY,
    });

    serverLog("Refresh → Access token renewed");

    return payload;
}
