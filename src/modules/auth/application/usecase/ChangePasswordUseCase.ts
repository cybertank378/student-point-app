//Files: src/modules/auth/application/usecase/ChangePasswordUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { AuthRepositoryInterface } from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";
import {serverLog} from "@/libs/serverLogger";

/**
 * ============================================================
 * CHANGE PASSWORD USE CASE
 * ============================================================
 *
 * Purpose:
 * - Allow authenticated user to change their password.
 *
 * Business Rules:
 * - User must exist.
 * - Old password must match current password.
 *
 * Architecture:
 * - Extends BaseUseCase to standardize Result handling.
 * - Does NOT manually return Result.
 * - Uses AppError for structured error handling.
 *
 * Execution Flow:
 *   Controller
 *        ↓
 *   execute(request)
 *        ↓
 *   handle(request)
 *        ↓
 *   return void
 *        ↓
 *   BaseUseCase wraps into Result.ok()
 *
 * Error Handling:
 * - User not found → AppError.notFound()
 * - Invalid old password → AppError.badRequest()
 * - Unexpected error → handled by BaseUseCase
 */

export interface ChangePasswordRequest {
    userId: string;
    oldPassword: string;
    newPassword: string;
}

export class ChangePasswordUseCase extends BaseUseCase<
    ChangePasswordRequest,
    void
> {
    constructor(
        private readonly repo: AuthRepositoryInterface,
        private readonly hash: HashServiceInterface
    ) {
        super();
    }

    /**
     * Core business logic.
     *
     * Responsibilities:
     * - Validate user existence
     * - Validate old password
     * - Hash new password
     * - Persist new password
     */
    protected async handle(
        request: ChangePasswordRequest
    ): Promise<void> {
        const { userId, oldPassword, newPassword } = request;

        const user = await this.repo.findById(userId);
        serverLog("Change password attempt", { userId });
        serverLog("Change password attempt", { userId, oldPassword, newPassword });

        if (!user) {
            throw AppError.notFound("User not found");
        }

        const valid = await this.hash.compare(
            oldPassword,
            user.password
        );

        if (!valid) {
            throw AppError.badRequest("Invalid old password");
        }

        const newHash = await this.hash.hash(newPassword);

        await this.repo.updatePassword(userId, newHash);
    }
}