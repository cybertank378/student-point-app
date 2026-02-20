//Files: src/modules/auth/application/usecases/ResetPasswordUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import crypto from "node:crypto";

import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";
import type { AuthRepositoryInterface } from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";

/**
 * ============================================================
 * RESET PASSWORD USE CASE
 * ============================================================
 *
 * Purpose:
 * - Validate reset token
 * - Update user password
 * - Mark token as used
 *
 * Security Strategy:
 * - Reset token stored hashed (SHA-256)
 * - Token must be valid & not expired
 * - Password hashed using HashService (bcrypt/argon)
 * - Token invalidated after use
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export class ResetPasswordUseCase extends BaseUseCase<
    ResetPasswordRequest,
    void
> {
    constructor(
        private readonly repo: AuthRepositoryInterface,
        private readonly hash: HashServiceInterface
    ) {
        super();
    }

    /**
     * Core reset password logic.
     */
    protected async handle(
        request: ResetPasswordRequest
    ): Promise<void> {
        const { token, newPassword } = request;

        /* =====================================================
           HASH TOKEN (DETERMINISTIC SHA-256)
        ===================================================== */
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const resetToken =
            await this.repo.findValidResetToken(hashedToken);

        if (!resetToken) {
            throw AppError.badRequest(
                "Invalid or expired reset token"
            );
        }

        /* =====================================================
           HASH NEW PASSWORD (bcrypt/argon)
        ===================================================== */
        const newHash = await this.hash.hash(newPassword);

        await this.repo.updatePassword(
            resetToken.userId,
            newHash
        );

        await this.repo.markResetTokenUsed(
            resetToken.id
        );
    }
}