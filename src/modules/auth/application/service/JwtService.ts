//Files: src/modules/auth/application/service/JwtService.ts
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "@/modules/shared/core/jwt";

import {
    TokenServiceInterface,
} from "@/modules/auth/domain/interfaces/TokenServiceInterface";

import { AuthPayload } from "@/modules/auth/domain/entity/AuthPayload";

/* ================= TYPE GUARD ================= */

function isAuthPayload(payload: unknown): payload is AuthPayload {
    if (typeof payload !== "object" || payload === null) {
        return false;
    }

    const record = payload as Record<string, unknown>;

    return (
        typeof record.sub === "string" &&
        typeof record.username === "string" &&
        typeof record.role === "string"
    );
}

/* ================= SERVICE ================= */

export class JwtService implements TokenServiceInterface {

    async generateAccessToken(
        payload: AuthPayload
    ): Promise<string> {
        return generateAccessToken(payload);
    }

    async generateRefreshToken(
        payload: AuthPayload
    ): Promise<string> {
        return generateRefreshToken(payload);
    }

    async verifyRefreshToken(
        token: string
    ): Promise<AuthPayload> {

        const payload = await verifyRefreshToken(token);

        if (!isAuthPayload(payload)) {
            throw new Error("Invalid refresh token payload");
        }

        return payload;
    }
}
