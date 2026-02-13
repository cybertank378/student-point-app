//Files: src/modules/achievement/application/usecases/UpdateAchievementUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type { UpdateAchievementDTO } from "@/modules/achievement/domain/dto/UpdateAchievementDTO";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";

export class UpdateAchievementUseCase {
    constructor(
        private readonly repo: AchievementInterface,
    ) {}

    async execute(
        dto: UpdateAchievementDTO,
    ): Promise<Result<Achievement>> {
        const updated = await this.repo.update(dto);
        return Result.ok(updated);
    }
}
