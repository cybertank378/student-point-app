//Files: src/modules/shared/core/jwt.ts
import { SignJWT, jwtVerify } from "jose";
import {SEVEN_DAYS} from "@/libs/utils";

const ACCESS_SECRET = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET!
);

const REFRESH_SECRET = new TextEncoder().encode(
    process.env.REFRESH_TOKEN_SECRET!
);

/**
 * =====================================================
 * GENERATE ACCESS TOKEN
 * =====================================================
 */
export async function generateAccessToken<T extends object>(
    payload: T
): Promise<string> {
    return new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(ACCESS_SECRET);
}

/**
 * =====================================================
 * GENERATE REFRESH TOKEN
 * =====================================================
 */
export async function generateRefreshToken<T extends object>(
    payload: T
): Promise<string> {
    return new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(SEVEN_DAYS)
        .sign(REFRESH_SECRET);
}

/**
 * =====================================================
 * VERIFY ACCESS TOKEN
 * =====================================================
 */
export async function verifyAccessToken(
    token: string
): Promise<unknown> {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload;
}

/**
 * =====================================================
 * VERIFY REFRESH TOKEN
 * =====================================================
 */
export async function verifyRefreshToken(
    token: string
): Promise<unknown> {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload;
}

