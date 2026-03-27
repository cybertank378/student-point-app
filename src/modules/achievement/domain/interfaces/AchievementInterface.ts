//Files: src/modules/achievement/domain/interfaces/AchievementInterface.ts
import type { CreateAchievementDTO } from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import type { UpdateAchievementDTO } from "@/modules/achievement/domain/dto/UpdateAchievementDTO";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";

import type {
    BasePaginationParams,
    BasePaginationResponse
} from "@/modules/shared/http/pagination/BasePagination";

export interface AchievementInterface {

    findAll(
        params: BasePaginationParams
    ): Promise<BasePaginationResponse<Achievement>>;

    findById(id: string): Promise<Achievement | null>;

    findByName(name: string): Promise<Achievement | null>;

    create(dto: CreateAchievementDTO): Promise<Achievement>;

    update(dto: UpdateAchievementDTO): Promise<Achievement>;

    softDelete(id: string): Promise<void>;

    isUsed(id: string): Promise<boolean>;
}