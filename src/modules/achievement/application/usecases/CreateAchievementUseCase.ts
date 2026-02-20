//Files: src/modules/achievement/application/usecases/CreateAchievementUseCase.ts

import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import type {AchievementInterface} from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type {CreateAchievementDTO} from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import type {Achievement} from "@/modules/achievement/domain/entity/Achievement";

/**
 * ============================================================
 * CREATE ACHIEVEMENT USE CASE
 * ============================================================
 *
 * Purpose:
 * - Handle creation of a new Achievement entity.
 *
 * Architecture:
 * - Extends BaseUseCase to standardize Result<Response>.
 * - Does NOT manually return Result.
 * - Error handling is centralized inside BaseUseCase.
 *
 * Execution Flow:
 *   Controller
 *        ↓
 *   execute(dto)       (BaseUseCase)
 *        ↓
 *   handle(dto)        (business logic)
 *        ↓
 *   return Achievement
 *        ↓
 *   BaseUseCase wraps into Result.ok()
 *
 * Error Handling:
 * - If repository throws error → BaseUseCase converts to Result.fail()
 * - No try/catch needed here.
 */
export class CreateAchievementUseCase extends BaseUseCase<
    CreateAchievementDTO,
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
     * - Persist new Achievement via repository
     * - Return created entity
     *
     * Notes:
     * - Do NOT wrap with Result here
     * - Throw Error if business validation is needed
     */
    protected async handle(
        dto: CreateAchievementDTO
    ): Promise<Achievement> {
        return await this.repo.create(dto);
    }
}