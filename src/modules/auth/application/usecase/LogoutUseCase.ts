//Files: src/modules/auth/application/usecase/LogoutUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import type { AuthRepositoryInterface } from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import crypto from "node:crypto";

/**
 * ============================================================
 * LOGOUT USE CASE
 * ============================================================
 *
 * Purpose:
 * - Revoke session by refresh token
 * - Revoke all active sessions for a user
 *
 * Behavior:
 * - Idempotent (safe if session not found)
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 * - No raw Error throwing
 */

export interface LogoutRequest {
    userId?: string;
    refreshToken?: string;
}

export class LogoutUseCase extends BaseUseCase<
    LogoutRequest,
    void
> {
    constructor(
        private readonly repo: AuthRepositoryInterface
    ) {
        super();
    }

    /**
     * Core logout logic.
     *
     * Supports:
     * - Logout by refresh token
     * - Logout all sessions by userId
     *
     * Throws:
     * - AppError.badRequest if request is invalid
     */
    protected async handle(
        request: LogoutRequest
    ): Promise<void> {
        const { refreshToken, userId } = request;

        /* =====================================================
           LOGOUT BY REFRESH TOKEN
        ===================================================== */
        if (refreshToken) {
            const tokenHash = crypto
                .createHash("sha256")
                .update(refreshToken)
                .digest("hex");

            const session =
                await this.repo.findSessionByTokenHash(tokenHash);

            if (!session) return; // idempotent

            await this.repo.revokeSession(session.id);
            return;
        }

        /* =====================================================
           LOGOUT ALL SESSIONS
        ===================================================== */
        if (userId) {
            const sessions =await this.repo.findValidSession(userId);

            for (const session of sessions) {
                await this.repo.revokeSession(session.id);
            }

            return;
        }

        /* =====================================================
           INVALID REQUEST
        ===================================================== */
        throw AppError.badRequest(
            "Invalid logout request: userId or refreshToken required"
        );
    }
}