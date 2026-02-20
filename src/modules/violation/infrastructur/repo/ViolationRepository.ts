// Files: src/modules/violation/infrastructure/repo/ViolationRepository.ts

import prisma from "@/libs/prisma";
import { ViolationMapper } from "@/modules/violation/domain/mapper/ViolationMapper";
import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import type { CreateViolationDTO } from "@/modules/violation/domain/dto/CreateViolationDTO";
import type { UpdateViolationDTO } from "@/modules/violation/domain/dto/UpdateViolationDTO";
import type { Violation } from "@/modules/violation/domain/entity/Violation";
import type { ViolationLevel } from "@/generated/prisma";
import type {
    BasePaginationParams,
    BasePaginationResponse,
} from "@/modules/shared/http/pagination/BasePagination";

export class ViolationRepository implements ViolationInterface {

    /* =========================================================
       FIND ALL WITH PAGINATION + SEARCH (B-TREE SAFE)
    ========================================================= */

    async findAll(
        params: BasePaginationParams,
    ): Promise<BasePaginationResponse<Violation>> {

        const page = params.page && params.page > 0 ? params.page : 1;
        const limit =
            params.limit && params.limit > 0
                ? Math.min(params.limit, 100)
                : 10;

        const skip = (page - 1) * limit;

        /**
         * =========================================================
         * B-TREE SAFE SEARCH STRATEGY
         * =========================================================
         *
         * - Avoid contains (LIKE %keyword%) → full scan
         * - Use startsWith → index friendly
         * - Ensure name column indexed in Prisma schema
         */

        const where = {
            deletedAt: null,
            ...(params.search && {
                name: {
                    startsWith: params.search, // B-tree friendly
                    mode: "insensitive" as const,
                },
            }),
        };

        const [rows, total] = await prisma.$transaction([
            prisma.violation.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [params.sortBy ?? "point"]:
                        params.sortOrder ?? "asc",
                },
            }),
            prisma.violation.count({ where }),
        ]);

        return {
            data: ViolationMapper.toDomainList(rows),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /* =========================================================
       FIND BY ID
    ========================================================= */

    async findById(id: string): Promise<Violation | null> {
        const row = await prisma.violation.findFirst({
            where: { id, deletedAt: null },
        });
        return row ? ViolationMapper.toDomain(row) : null;
    }

    /* =========================================================
       CREATE
    ========================================================= */

    async create(
        dto: CreateViolationDTO & { level: ViolationLevel },
    ): Promise<Violation> {
        const row = await prisma.violation.create({
            data: {
                name: dto.name,
                point: dto.point,
                level: dto.level,
            },
        });
        return ViolationMapper.toDomain(row);
    }

    /* =========================================================
       UPDATE
    ========================================================= */

    async update(
        dto: UpdateViolationDTO & { level: ViolationLevel },
    ): Promise<Violation> {
        const row = await prisma.violation.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                point: dto.point,
                level: dto.level,
            },
        });
        return ViolationMapper.toDomain(row);
    }

    /* =========================================================
       SOFT DELETE
    ========================================================= */

    async softDelete(id: string): Promise<void> {
        await prisma.violation.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    /* =========================================================
       CHECK USAGE
    ========================================================= */

    async isUsed(id: string): Promise<boolean> {
        const count = await prisma.studentViolation.count({
            where: { violationId: id },
        });
        return count > 0;
    }
}