//Files: src/modules/achievement/application/usecases/UpdateAchievementUseCase.ts
import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import type {AchievementInterface} from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type {UpdateAchievementDTO} from "@/modules/achievement/domain/dto/UpdateAchievementDTO";
import type {Achievement} from "@/modules/achievement/domain/entity/Achievement";

/**
 * ============================================================
 * UPDATE ACHIEVEMENT USE CASE
 * ============================================================
 *
 * Purpose:
 * - Update an existing Achievement entity.
 *
 * Architecture:
 * - Extends BaseUseCase to standardize Result handling.
 * - Does NOT manually return Result.
 * - Error handling is centralized in BaseUseCase.
 *
 * Execution Flow:
 *   Controller
 *        ↓
 *   execute(dto)      (BaseUseCase)
 *        ↓
 *   handle(dto)
 *        ↓
 *   return Achievement
 *        ↓
 *   BaseUseCase wraps into Result.ok()
 *
 * Error Handling:
 * - Any repository error will automatically
 *   be converted into Result.fail() by BaseUseCase.
 */
export class UpdateAchievementUseCase extends BaseUseCase<
    UpdateAchievementDTO,
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
     * - Persist updated Achievement entity
     * - Return updated entity
     *
     * Notes:
     * - No manual Result wrapping
     * - No try/catch here
     */
    protected async handle(
        dto: UpdateAchievementDTO
    ): Promise<Achievement> {
        return await this.repo.update(dto);
    }
}