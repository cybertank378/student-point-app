//Files: src/modules/achievement/application/usecases/DeleteAchievementUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";

/**
 * ============================================================
 * DELETE ACHIEVEMENT USE CASE
 * ============================================================
 *
 * Purpose:
 * - Soft delete an Achievement entity.
 *
 * Business Rules:
 * - Achievement cannot be deleted if already used.
 *
 * Architecture:
 * - Extends BaseUseCase (centralized Result handling)
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 *
 * Error Strategy:
 * - Domain/application errors throw AppError
 * - BaseUseCase converts thrown AppError into Result.fail()
 * - HttpResultHandler converts AppError into proper HTTP response
 */
export class DeleteAchievementUseCase extends BaseUseCase<
    string,
    void
> {
    constructor(
        private readonly repo: AchievementInterface
    ) {
        super();
    }

    /**
     * Core business logic.
     *
     * Responsibilities:
     * - Ensure achievement is not already used
     * - Perform soft delete
     *
     * Throws:
     * - AppError.conflict if achievement already used
     */
    protected async handle(id: string): Promise<void> {
        const used = await this.repo.isUsed(id);

        if (used) {
            throw AppError.conflict(
                "Achievement already used and cannot be deleted"
            );
        }

        await this.repo.softDelete(id);
    }
}