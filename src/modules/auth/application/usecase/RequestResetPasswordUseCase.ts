import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import { FIFTEEN_MINUTES } from "@/libs/utils";
import { randomUUID } from "node:crypto";

import type { AuthRepositoryInterface } from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";

/**
 * ============================================================
 * REQUEST RESET PASSWORD USE CASE
 * ============================================================
 *
 * Purpose:
 * - Generate password reset token
 * - Store hashed token with expiration
 * - Return raw token (to be sent via email)
 *
 * Security Strategy:
 * - Raw token generated via randomUUID()
 * - Only hashed token stored in database
 * - Token expires after 15 minutes
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */

export interface RequestResetPasswordRequest {
    username: string;
}

export interface RequestResetPasswordResponse {
    resetToken: string;
}

export class RequestResetPasswordUseCase extends BaseUseCase<
    RequestResetPasswordRequest,
    RequestResetPasswordResponse
> {
    constructor(
        private readonly repo: AuthRepositoryInterface,
        private readonly hash: HashServiceInterface
    ) {
        super();
    }

    /**
     * Core reset request logic.
     *
     * Responsibilities:
     * - Validate user existence
     * - Generate secure token
     * - Hash token before storing
     * - Save token with expiration
     */
    protected async handle(
        request: RequestResetPasswordRequest
    ): Promise<RequestResetPasswordResponse> {
        const { username } = request;

        const user = await this.repo.findByUsername(username);

        if (!user) {
            throw AppError.notFound("User not found");
        }

        const rawToken = randomUUID();

        const hashedToken = await this.hash.hash(rawToken);

        await this.repo.createResetToken(
            user.id,
            hashedToken,
            new Date(Date.now() + FIFTEEN_MINUTES)
        );

        return {
            resetToken: rawToken,
        };
    }
}