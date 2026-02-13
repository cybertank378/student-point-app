//Files: src/modules/achievement/application/usecases/DeleteAchievementUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";

export class DeleteAchievementUseCase {
    constructor(
        private readonly repo: AchievementInterface,
    ) {}

    async execute(id: string): Promise<Result<void>> {
        const used = await this.repo.isUsed(id);

        if (used) {
            return Result.fail(
                "Achievement already used and cannot be deleted",
            );
        }

        await this.repo.softDelete(id);
        return Result.ok(undefined);
    }
}
