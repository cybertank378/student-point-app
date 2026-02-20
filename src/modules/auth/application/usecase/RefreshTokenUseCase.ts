//Files: src/modules/auth/application/usecase/RefreshTokenUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import { SEVEN_DAYS } from "@/libs/utils";

import type { AuthRepositoryInterface } from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";
import type { TokenServiceInterface } from "@/modules/auth/domain/interfaces/TokenServiceInterface";

/**
 * ============================================================
 * REFRESH TOKEN USE CASE
 * ============================================================
 *
 * Purpose:
 * - Validate refresh token
 * - Perform token rotation
 * - Revoke old session
 * - Issue new access & refresh token
 *
 * Security Strategy:
 * - Verify JWT refresh token
 * - Match against stored hashed session
 * - Revoke old session (rotation)
 * - Store new hashed refresh token
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export class RefreshTokenUseCase extends BaseUseCase<
    RefreshTokenRequest,
    RefreshTokenResponse
> {
    constructor(
        private readonly repo: AuthRepositoryInterface,
        private readonly hash: HashServiceInterface,
        private readonly token: TokenServiceInterface
    ) {
        super();
    }

    /**
     * Core refresh token rotation logic.
     */
    protected async handle(
        request: RefreshTokenRequest
    ): Promise<RefreshTokenResponse> {
        const { refreshToken } = request;

        /* =====================================================
           VERIFY REFRESH TOKEN (JWT VALIDATION)
        ===================================================== */
        const payload =
            await this.token.verifyRefreshToken(refreshToken);

        if (!payload?.sub) {
            throw AppError.unauthorized("Invalid refresh token");
        }

        /* =====================================================
           VALIDATE SESSION AGAINST STORED HASH
        ===================================================== */

        const sessions =
            await this.repo.findValidSession(payload.sub);

        let validSessionId: string | null = null;

        for (const session of sessions) {
            const match = await this.hash.compare(
                refreshToken,
                session.tokenHash
            );

            if (match) {
                validSessionId = session.id;
                break;
            }
        }

        if (!validSessionId) {
            throw AppError.unauthorized("Invalid session");
        }

        /* =====================================================
           ROTATE TOKEN (REVOKE OLD SESSION)
        ===================================================== */

        await this.repo.revokeSession(validSessionId);

        const newPayload = {
            sub: payload.sub,
            username: payload.username,
            role: payload.role,
            teacherRole: payload.teacherRole,
        };

        const newAccess =
            await this.token.generateAccessToken(newPayload);

        const newRefresh =
            await this.token.generateRefreshToken(newPayload);

        const newHash = await this.hash.hash(newRefresh);

        await this.repo.saveSession(
            payload.sub,
            newHash,
            new Date(Date.now() + SEVEN_DAYS)
        );

        return {
            accessToken: newAccess,
            refreshToken: newRefresh,
        };
    }
}