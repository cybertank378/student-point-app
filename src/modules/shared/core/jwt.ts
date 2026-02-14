//Files: src/modules/shared/core/jwt.ts
import {
    SignJWT,
    jwtVerify,
    JWTPayload,
    errors,
} from "jose";
import {ACCESS_TOKEN_EXPIRE, ONE_DAY, SEVEN_DAYS} from "@/libs/utils";

/* =====================================================
   SECRET SETUP
===================================================== */

if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

const ACCESS_SECRET = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET
);

const REFRESH_SECRET = new TextEncoder().encode(
    process.env.REFRESH_TOKEN_SECRET
);

/* =====================================================
   GENERATE ACCESS TOKEN
===================================================== */

export async function generateAccessToken<
    T extends JWTPayload
>(payload: T): Promise<string> {

    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(ACCESS_TOKEN_EXPIRE)
        .sign(ACCESS_SECRET);
}

/* =====================================================
   GENERATE REFRESH TOKEN
===================================================== */

export async function generateRefreshToken<
    T extends JWTPayload
>(payload: T): Promise<string> {

    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(ACCESS_TOKEN_EXPIRE)
        .sign(REFRESH_SECRET);
}

/* =====================================================
   VERIFY ACCESS TOKEN
===================================================== */

export async function verifyAccessToken(
    token: string
): Promise<JWTPayload | null> {

    try {

        const { payload } = await jwtVerify(
            token,
            ACCESS_SECRET,
            { algorithms: ["HS256"] }
        );

        return payload;

    } catch (error: unknown) {

        if (error instanceof errors.JWTExpired) {
            console.warn("[JWT] Access token expired");
            return null;
        }

        if (error instanceof Error) {
            console.error("[JWT] Access token invalid:", error.message);
        }

        return null;
    }
}

/* =====================================================
   VERIFY REFRESH TOKEN
===================================================== */

export async function verifyRefreshToken(
    token: string
): Promise<JWTPayload | null> {

    try {

        const { payload } = await jwtVerify(
            token,
            REFRESH_SECRET,
            { algorithms: ["HS256"] }
        );

        return payload;

    } catch (error: unknown) {

        if (error instanceof errors.JWTExpired) {
            console.warn("[JWT] Refresh token expired");
            return null;
        }

        if (error instanceof Error) {
            console.error("[JWT] Refresh token invalid:", error.message);
        }

        return null;
    }
}
