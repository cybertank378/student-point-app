//Files: src/modules/achievement/application/usecases/ListAchievementUseCase.ts
import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import type {AchievementInterface} from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type {Achievement} from "@/modules/achievement/domain/entity/Achievement";

/**
 * ============================================================
 * LIST ACHIEVEMENT USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve all Achievement entities.
 *
 * Architecture:
 * - Extends BaseUseCase to standardize Result handling.
 * - Does NOT manually return Result.
 * - No try/catch required (handled by BaseUseCase).
 *
 * Execution Flow:
 *   Controller
 *        ↓
 *   execute()          (BaseUseCase)
 *        ↓
 *   handle()
 *        ↓
 *   return Achievement[]
 *        ↓
 *   BaseUseCase wraps into Result.ok()
 *
 * Error Handling:
 * - Any thrown error from repository
 *   will automatically be converted
 *   into Result.fail() by BaseUseCase.
 */
export class ListAchievementUseCase extends BaseUseCase<
    void,
    Achievement[]
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
     * - Fetch all achievements from repository
     * - Return list of Achievement entities
     *
     * Notes:
     * - No manual Result wrapping
     * - No manual error handling
     */
    protected async handle(): Promise<Achievement[]> {
        return await this.repo.findAll();
    }
}