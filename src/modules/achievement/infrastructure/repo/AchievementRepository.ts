//Files: src/modules/achievement/infrastructur/repo/AchievementRepository.ts
import prisma from "@/libs/prisma";
import type { Prisma } from "@/generated/prisma";

import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";
import type { CreateAchievementDTO } from "@/modules/achievement/domain/dto/CreateAchievementDTO";
import type { UpdateAchievementDTO } from "@/modules/achievement/domain/dto/UpdateAchievementDTO";
import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";

import { AchievementMapper } from "@/modules/achievement/domain/mapper/AchievementMapper";

import type {
    BasePaginationParams,
    BasePaginationResponse
} from "@/modules/shared/http/pagination/BasePagination";

export class AchievementRepository implements AchievementInterface {

    async findAll(
        params: BasePaginationParams
    ): Promise<BasePaginationResponse<Achievement>> {

        const page = params.page && params.page > 0 ? params.page : 1;

        const limit =
            params.limit && params.limit > 0
                ? Math.min(params.limit, 100)
                : 10;

        const skip = (page - 1) * limit;

        const where: Prisma.AchievementWhereInput = {
            deletedAt: null,
            ...(params.search && {
                name: {
                    contains: params.search,
                    mode: "insensitive"
                }
            })
        };

        const allowedSortFields: Array<
            keyof Prisma.AchievementOrderByWithRelationInput
        > = ["name", "point", "createdAt"];

        const sortBy =
            allowedSortFields.includes(
                params.sortBy as keyof Prisma.AchievementOrderByWithRelationInput
            )
                ? (params.sortBy as keyof Prisma.AchievementOrderByWithRelationInput)
                : "point";

        const sortOrder: Prisma.SortOrder =
            params.sortOrder === "desc" ? "desc" : "asc";

        const [rows, total] = await prisma.$transaction([
            prisma.achievement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true,
                    name: true,
                    point: true,
                    createdAt: true,
                    deletedAt: true
                }
            }),
            prisma.achievement.count({ where })
        ]);

        return {
            data: AchievementMapper.toDomainList(rows),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findById(id: string): Promise<Achievement | null> {

        const row = await prisma.achievement.findFirst({
            where: {
                id,
                deletedAt: null
            }
        });

        return row
            ? AchievementMapper.toDomain(row)
            : null;
    }

    async findByName(name: string): Promise<Achievement | null> {

        const row = await prisma.achievement.findFirst({
            where: {
                name,
                deletedAt: null
            }
        });

        return row
            ? AchievementMapper.toDomain(row)
            : null;
    }

    async create(dto: CreateAchievementDTO): Promise<Achievement> {

        const row = await prisma.achievement.create({
            data: {
                name: dto.name,
                point: dto.point
            }
        });

        return AchievementMapper.toDomain(row);
    }


    async update(dto: UpdateAchievementDTO): Promise<Achievement> {

        const row = await prisma.achievement.update({
            where: {
                id: dto.id
            },
            data: {
                name: dto.name,
                point: dto.point
            }
        });

        return AchievementMapper.toDomain(row);
    }

    async isUsed(id: string): Promise<boolean> {

        const count =
            await prisma.studentAchievement.count({
                where: { achievementId: id }
            });

        return count > 0;
    }

    async softDelete(id: string): Promise<void> {

        await prisma.achievement.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });
    }

}