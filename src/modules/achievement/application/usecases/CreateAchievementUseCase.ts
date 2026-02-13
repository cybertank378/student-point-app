//Files: src/modules/achievement/application/usecases/CreateAchievementUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type { CreateAchievementDTO } from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";

export class CreateAchievementUseCase {
    constructor(
        private readonly repo: AchievementInterface,
    ) {}

    async execute(
        dto: CreateAchievementDTO,
    ): Promise<Result<Achievement>> {
        const created = await this.repo.create(dto);
        return Result.ok(created);
    }
}
