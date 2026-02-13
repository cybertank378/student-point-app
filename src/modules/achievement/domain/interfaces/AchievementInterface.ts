//Files: src/modules/achievement/domain/interfaces/AchievementInterface.ts
import {CreateAchievementDTO} from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import {Achievement} from "@/modules/achievement/domain/entity/Achievement";
import {UpdateAchievementDTO} from "@/modules/achievement/domain/dto/UpdateAchievementDTO";

/**
 * Port / Contract
 * Infrastructure (Prisma) WAJIB implement ini
 */
export interface AchievementInterface {
    findAll(): Promise<Achievement[]>;
    findById(id: string): Promise<Achievement | null>;

    create(dto: CreateAchievementDTO): Promise<Achievement>;
    update(dto: UpdateAchievementDTO): Promise<Achievement>;

    softDelete(id: string): Promise<void>;
    isUsed(id: string): Promise<boolean>;
}