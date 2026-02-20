// Files: src/modules/user/application/usecases/GetUserStatsUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import type { UserStatsResponseDTO } from "@/modules/user/domain/dto/UserStatsResponseDTO";

/**
 * ============================================================
 * GET USER STATS USE CASE
 * ============================================================
 *
 * Responsible for:
 * - Retrieving aggregated user statistics
 * - Returning structured UserStatsResponseDTO
 *
 * Pattern:
 *   execute() -> Result<UserStatsResponseDTO>
 *
 * Extends:
 *   BaseUseCase<void, UserStatsResponseDTO>
 *
 * Notes:
 * - No try/catch inside this class
 * - Infrastructure errors are handled by BaseUseCase
 * - No console logging (should be handled globally)
 */
export class GetUserStatsUseCase extends BaseUseCase<
    void,
    UserStatsResponseDTO
> {
    constructor(private readonly userRepository: UserInterface) {
        super();
    }

    /**
     * ============================================================
     * BUSINESS LOGIC
     * ============================================================
     *
     * Steps:
     * 1. Fetch aggregated statistics from a repository
     * 2. Return DTO
     *
     * Any thrown error will be caught by BaseUseCase.execute()
     * and converted into Result.fail()
     */
    protected async handle(): Promise<UserStatsResponseDTO> {

        const stats = await this.userRepository.getUserStats();

        /**
         * Optional safety check (if the repository could return null)
         */
        if (!stats) {
            throw new Error("Statistik user tidak tersedia.");
        }

        return stats;
    }
}