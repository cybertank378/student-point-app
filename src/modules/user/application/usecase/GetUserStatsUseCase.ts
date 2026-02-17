//Files: src/modules/user/application/usecases/GetUserStatsUseCase.ts

import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import { Result } from "@/modules/shared/core/Result";
import type {UserStatsResponseDTO} from "@/modules/user/domain/dto/UserStatsResponseDTO";


export class GetUserStatsUseCase {
    constructor(private readonly userRepository: UserInterface) {}

    async execute(): Promise<Result<UserStatsResponseDTO>> {
        try {
            const stats = await this.userRepository.getUserStats();
            console.log("GetUserStatsUseCase Result:", stats.totalStudentUsers);

            return Result.ok<UserStatsResponseDTO>(stats);
        } catch (error) {
            console.error("GetUserStatsUseCase Error:", error);

            return Result.fail<UserStatsResponseDTO>(
                "Failed to fetch user statistics"
            );
        }
    }
}
