//Files: src/modules/achievement/domain/mapper/AchievementMapper.ts

import {Achievement} from "@/modules/achievement/domain/entity/Achievement";
import type { Achievement as PrismaAchievement } from "@/generated/prisma";

/**
 * Mapper: Prisma → Domain
 * Tidak ada logic bisnis
 */
export class AchievementMapper {
    static toDomain(row: PrismaAchievement): Achievement {
        return new Achievement(
            row.id,
            row.name,
            row.point,
            row.createdAt,
            row.deletedAt,
        );
    }

    static toDomainList(
        rows: PrismaAchievement[],
    ): Achievement[] {
        return rows.map(this.toDomain);
    }
}