//Files: src/modules/achievement/application/usecases/CreateAchievementUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { CreateAchievementDTO } from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";
import {AchievementInterface} from "@/modules/achievement/domain/interfaces/AchievementInterface";

export class CreateAchievementUseCase extends BaseUseCase<
    CreateAchievementDTO,
    Achievement
> {

    constructor(
        private readonly repo: AchievementInterface
    ) {
        super();
    }

    protected async handle(dto: CreateAchievementDTO): Promise<Achievement> {

        const existing = await this.repo.findByName(dto.name);

        if (existing) {
            throw AppError.conflict("Achievement with this name already exists");
        }

        return await this.repo.create(dto);
    }

}