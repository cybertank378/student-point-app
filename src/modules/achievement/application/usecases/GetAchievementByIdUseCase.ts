//Files: src/modules/achievement/application/usecases/GetAchievementByIdUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";

export class GetAchievementByIdUseCase {
    constructor(
        private readonly repo: AchievementInterface,
    ) {}

    async execute(id: string): Promise<Result<Achievement>> {
        const achievement = await this.repo.findById(id);

        if (!achievement) {
            return Result.fail("Achievement not found");
        }

        return Result.ok(achievement);
    }
}
