
//Files: src/modules/teacher/infrastructure/repo/TeacherRepository.ts

import prisma from "@/libs/prisma";
import { Prisma, TeacherRole } from "@/generated/prisma";

import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import type {
    TeacherSearchParams,
    TeacherSearchResult,
} from "@/modules/teacher/domain/dto/ListTeacherRespDTO";

import { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import { TeacherMapper } from "@/modules/teacher/domain/mapper/TeacherMapper";
import { BasePaginationParams } from "@/modules/shared/http/pagination/BasePagination";
import {
    buildCreatePayload,
    buildOrderBy,
    teacherInclude
} from "@/modules/student/domain/mapper/PayloadBuilder";



/**
 * ============================================================
 * TEACHER REPOSITORY
 * ============================================================
 *
 * Infrastructure Layer
 * - Implements TeacherInterface
 * - Fully typed
 * - No duplicate logic
 * - Optimized for high volume
 */
export class TeacherRepository implements TeacherInterface {


    /* =========================================================
       FIND ALL (Paginated + Role Filter)
    ========================================================= */
    /**
     * Retrieve paginated teacher list.
     * Supports:
     * - B-Tree optimized prefix search
     * - Role filter (an array contains)
     */
    async findAll(
        params: BasePaginationParams & { role?: string }
    ): Promise<{ data: ReadonlyArray<Teacher>; total: number }> {

        const page = params.page && params.page > 0 ? params.page : 1;
        const limit = params.limit && params.limit > 0 ? params.limit : 10;
        const skip = (page - 1) * limit;

        const where: Prisma.TeacherWhereInput = {};

        if (params.search) {
            where.OR = [
                {
                    name: {
                        contains: params.search,
                        mode: "insensitive",
                    },
                },
                {
                    nip: {
                        contains: params.search, // ✅ sekarang string
                    },
                },
                {
                    nuptk: {
                        contains: params.search,
                    },
                },
                {
                    nrk: {
                        contains: params.search,
                    },
                },
                {
                    nrg: {
                        contains: params.search,
                    },
                },
            ];
        }

        if (params.role) {
            where.roles = { has: params.role as TeacherRole };
        }

        const [rows, total] = await Promise.all([
            prisma.teacher.findMany({
                where,
                skip,
                take: limit,
                include: teacherInclude,
                orderBy: { name: "asc" },
            }),
            prisma.teacher.count({ where }),
        ]);

        return {
            data: TeacherMapper.toDomainList(rows),
            total,
        };
    }

    /* =========================================================
       FIND BY ID
    ========================================================= */
    /**
     * Retrieve teacher by primary ID.
     */
    async findById(id: string): Promise<Teacher | null> {
        const row = await prisma.teacher.findUnique({
            where: { id },
            include: teacherInclude,
        });

        return row ? TeacherMapper.toDomain(row) : null;
    }

    /* =========================================================
       FIND BY UNIQUE IDENTIFIERS (BigInt)
    ========================================================= */

    async findByNip(nip: string): Promise<Teacher | null> {
        const row = await prisma.teacher.findUnique({
            where: { nip },
            include: teacherInclude,
        });

        return row ? TeacherMapper.toDomain(row) : null;
    }

    async findByNuptk(nuptk: string): Promise<Teacher | null> {
        const row = await prisma.teacher.findUnique({
            where: { nuptk },
            include: teacherInclude,
        });

        return row ? TeacherMapper.toDomain(row) : null;
    }

    async findByNrk(nrk: string): Promise<Teacher | null> {
        const row = await prisma.teacher.findUnique({
            where: { nrk },
            include: teacherInclude,
        });

        return row ? TeacherMapper.toDomain(row) : null;
    }
    /* =========================================================
       CREATE
    ========================================================= */
    /**
     * Create a new teacher entity.
     */
    async create(dto: CreateTeacherDTO): Promise<Teacher> {
        const created = await prisma.teacher.create({
            data: buildCreatePayload(dto),
            include: teacherInclude,
        });

        return TeacherMapper.toDomain(created);
    }

    /* =========================================================
       UPDATE
    ========================================================= */
    async update(dto: UpdateTeacherDTO): Promise<Teacher> {

        const { id, roles, homeroomClassIds, ...rest } = dto;

        const data: Prisma.TeacherUpdateInput = {};

        // 🔥 assign only defined values
        (Object.keys(rest) as (keyof typeof rest)[]).forEach((key) => {
            const value = rest[key];
            if (value !== undefined) {
                (data as Record<string, unknown>)[key] = value;
            }
        });

        // 🔥 handle roles relation
        if (roles !== undefined) {
            data.roles = roles;
        }

        const updated = await prisma.teacher.update({
            where: { id },
            data,
            include: teacherInclude,
        });

        return TeacherMapper.toDomain(updated);
    }

    /* =========================================================
       UPDATE ROLES
    ========================================================= */
    /**
     * Replace teacher roles.
     */

    async bulkAssignRoles(teacherIds: string[],roles: TeacherRole[]): Promise<void> {
        await prisma.teacher.updateMany({
            where: { id: { in: teacherIds } },
            data: { roles: { set: roles } },
        });
    }

    async bulkAssignHomeroom(teacherIds: string[],rombelIds: string[]): Promise<void> {
        await prisma.$transaction(
            teacherIds.map((teacherId) =>
                prisma.teacher.update({
                    where: { id: teacherId },
                    data: {
                        homeroomOf: {
                            set: rombelIds.map((id) => ({ id })),
                        },
                    },
                })
            )
        );
    }

    async withTransaction<T>(callback: () => Promise<T>): Promise<T> {
        return prisma.$transaction(async () => callback());
    }

    /* =========================================================
       DELETE
    ========================================================= */
    /**
     * Permanently delete teacher.
     */
    async delete(id: string): Promise<void> {
        await prisma.teacher.delete({ where: { id } });
    }

    /* =========================================================
       ADVANCED SEARCH
    ========================================================= */
    /**
     * Advanced filtering:
     * - name prefix
     * - role
     * - religionId
     * - dynamic sorting
     */
    async search(
        params: TeacherSearchParams
    ): Promise<TeacherSearchResult> {

        const skip = (params.page - 1) * params.limit;

        const filters: Prisma.TeacherWhereInput[] = [];

        if (params.name) {
            filters.push({
                name: { startsWith: params.name, mode: "insensitive" },
            });
        }

        if (params.role) {
            filters.push({ roles: { has: params.role } });
        }

        if (params.religionCode) {
            filters.push({ religionCode: params.religionCode });
        }

        const where =
            filters.length > 0 ? { AND: filters } : {};

        const [rows, total] = await Promise.all([
            prisma.teacher.findMany({
                where,
                skip,
                take: params.limit,
                orderBy: buildOrderBy(
                    params.sortBy,
                    params.sortOrder
                ),
                include: teacherInclude,
            }),
            prisma.teacher.count({ where }),
        ]);

        return {
            data: TeacherMapper.toDomainList(rows),
            total,
            page: params.page,
            limit: params.limit,
        };
    }

    /* ============================================================
   BULK IMPORT CREATE
============================================================ */

    async bulkImportCreate(
        data: CreateTeacherDTO[]
    ): Promise<{ inserted: number }> {
        if (!data.length) {
            return { inserted: 0 };
        }

        const result = await prisma.teacher.createMany({
            data: data.map((dto) => buildCreatePayload(dto)),
            skipDuplicates: true,
        });

        return {
            inserted: result.count,
        };
    }

    /* ============================================================
       EXPORT
    ============================================================ */

    async findAllForExport(params?: {
        role?: string;
    }): Promise<ReadonlyArray<Teacher>> {
        const where: Prisma.TeacherWhereInput = {};

        if (params?.role) {
            where.roles = {
                has: params.role as TeacherRole,
            };
        }

        const rows = await prisma.teacher.findMany({
            where,
            include: teacherInclude,
            orderBy: { createdAt: "desc" },
        });

        return TeacherMapper.toDomainList(rows);
    }

    async findExistingIdentifiers(params: {
        nips: string[];
        nuptks: string[];
        nrks: string[];
    }): Promise<{
        nips: Set<string>;
        nuptks: Set<string>;
        nrks: Set<string>;
    }> {
        const conditions: Prisma.TeacherWhereInput[] = [];

        if (params.nips.length > 0) {
            conditions.push({
                nip: { in: params.nips },
            });
        }

        if (params.nuptks.length > 0) {
            conditions.push({
                nuptk: { in: params.nuptks },
            });
        }

        if (params.nrks.length > 0) {
            conditions.push({
                nrk: { in: params.nrks },
            });
        }

        // 🔹 If no identifiers provided, skip query entirely
        if (conditions.length === 0) {
            return {
                nips: new Set(),
                nuptks: new Set(),
                nrks: new Set(),
            };
        }

        const rows = await prisma.teacher.findMany({
            where: {
                OR: conditions,
            },
            select: {
                nip: true,
                nuptk: true,
                nrk: true,
            },
        });

        const nipSet = new Set<string>();
        const nuptkSet = new Set<string>();
        const nrkSet = new Set<string>();

        for (const row of rows) {
            if (row.nip !== null) nipSet.add(row.nip);
            if (row.nuptk !== null) nuptkSet.add(row.nuptk);
            if (row.nrk !== null) nrkSet.add(row.nrk);
        }

        return {
            nips: nipSet,
            nuptks: nuptkSet,
            nrks: nrkSet,
        };
    }
}
