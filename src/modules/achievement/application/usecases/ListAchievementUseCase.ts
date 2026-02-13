//Files: src/modules/achievement/application/usecases/ListAchievementUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";

export class ListAchievementUseCase {
    constructor(
        private readonly repo: AchievementInterface,
    ) {}

    async execute(): Promise<Result<Achievement[]>> {
        const rows = await this.repo.findAll();
        return Result.ok(rows);
    }
}