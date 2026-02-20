//Files: src/modules/achievement/application/usecases/GetAchievementByIdUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";

/**
 * ============================================================
 * GET ACHIEVEMENT BY ID USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve a single Achievement entity by its ID.
 *
 * Business Rules:
 * - Achievement must exist.
 *
 * Architecture:
 * - Extends BaseUseCase for standardized Result handling.
 * - Does NOT manually return Result.
 * - Uses AppError for structured error handling.
 *
 * Execution Flow:
 *   Controller
 *        ↓
 *   execute(id)       (BaseUseCase)
 *        ↓
 *   handle(id)
 *        ↓
 *   return Achievement
 *        ↓
 *   BaseUseCase wraps into Result.ok()
 *
 * Error Handling:
 * - If achievement not found → throw AppError.notFound()
 * - BaseUseCase converts it into Result.fail()
 * - HttpResultHandler maps it to proper HTTP response
 */
export class GetAchievementByIdUseCase extends BaseUseCase<
    string,
    Achievement
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
     * - Fetch achievement by ID
     * - Validate existence
     *
     * Throws:
     * - AppError.notFound if entity does not exist
     */
    protected async handle(id: string): Promise<Achievement> {
        const achievement = await this.repo.findById(id);

        if (!achievement) {
            throw AppError.notFound("Achievement not found");
        }

        return achievement;
    }
}