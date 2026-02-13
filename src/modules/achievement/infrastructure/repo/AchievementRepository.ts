//Files: src/modules/achievement/infrastructur/repo/AchievementRepository.ts

import  prisma  from "@/libs/prisma";
import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type { CreateAchievementDTO } from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import type { UpdateAchievementDTO } from "@/modules/achievement/domain/dto/UpdateAchievementDTO";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";
import {AchievementMapper} from "@/modules/achievement/domain/mapper/AchievementMapper";

/**
 * Prisma Repository
 * Implement domain contract
 */
export class AchievementRepository
    implements AchievementInterface
{
    async findAll(): Promise<Achievement[]> {
        const rows = await prisma.achievement.findMany({
            where: { deletedAt: null },
            orderBy: { point: "desc" },
        });

        return AchievementMapper.toDomainList(rows);
    }

    async findById(
        id: string,
    ): Promise<Achievement | null> {
        const row = await prisma.achievement.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        return row
            ? AchievementMapper.toDomain(row)
            : null;
    }

    async create(
        dto: CreateAchievementDTO,
    ): Promise<Achievement> {
        const row = await prisma.achievement.create({
            data: {
                name: dto.name,
                point: dto.point,
            },
        });

        return AchievementMapper.toDomain(row);
    }

    async update(
        dto: UpdateAchievementDTO,
    ): Promise<Achievement> {
        const row = await prisma.achievement.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                point: dto.point,
            },
        });

        return AchievementMapper.toDomain(row);
    }

    /**
     * Cek apakah achievement sudah dipakai
     * (student_achievement)
     */
    async isUsed(id: string): Promise<boolean> {
        const count =
            await prisma.studentAchievement.count({
                where: { achievementId: id },
            });

        return count > 0;
    }

    /**
     * Soft delete
     */
    async softDelete(id: string): Promise<void> {
        await prisma.achievement.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
