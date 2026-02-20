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

/**
 * ============================================================
 * RELATION INCLUDE CONFIG (Single Source of Truth)
 * ============================================================
 */
const teacherInclude = {
    religion: true,
    homeroomOf: true,
} satisfies Prisma.TeacherInclude;

/**
 * All valid sortable fields derived directly from Prisma.
 * Fully type-safe and auto-updated if schema changes.
 */
type TeacherOrderableField =
    keyof Prisma.TeacherOrderByWithRelationInput;

/**
 * Normalize nullable values for Prisma payload.
 */
const normalizeNullable = <T>(
    value: T | null | undefined
): T | undefined => value ?? undefined;

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
       PRIVATE: Build Persistence Payload
    ========================================================= */
    /**
     * Build Prisma-compatible payload from DTO.
     * Single reusable source of truth.
     */
    private buildPayload(dto: CreateTeacherDTO | UpdateTeacherDTO): Prisma.TeacherUncheckedCreateInput {
        return {
            nip: normalizeNullable(dto.nip),
            nuptk: normalizeNullable(dto.nuptk),
            nrk: normalizeNullable(dto.nrk),
            nrg: normalizeNullable(dto.nrg),

            name: dto.name,
            gender: dto.gender,
            religionCode: dto.religionCode,

            phone: normalizeNullable(dto.phone),
            email: normalizeNullable(dto.email),
            photo: normalizeNullable(dto.photo),

            educationLevel: dto.educationLevel,
            major: normalizeNullable(dto.major),
            graduationYear: dto.graduationYear,

            birthPlace: dto.birthPlace,
            birthDate: dto.birthDate,

            civilServantRank: normalizeNullable(dto.civilServantRank),

            roles: dto.roles,
            isPns: dto.isPns,
        };
    }

    /* =========================================================
       PRIVATE: Build OrderBy
    ========================================================= */
    /**
     * Safely build Prisma orderBy object.
     * Prevents invalid dynamic key injection.
     */
    private buildOrderBy(
        sortBy?: TeacherOrderableField,
        sortOrder: Prisma.SortOrder = "asc"
    ): Prisma.TeacherOrderByWithRelationInput {
        if (!sortBy) {
            return { name: "asc" };
        }

        return {
            [sortBy]: sortOrder,
        };
    }

    /* =========================================================
       FIND ALL (Paginated + Role Filter)
    ========================================================= */
    /**
     * Retrieve paginated teacher list.
     * Supports:
     * - B-Tree optimized prefix search
     * - Role filter (array contains)
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
                { name: { startsWith: params.search, mode: "insensitive" } },
                { nip: { startsWith: params.search } },
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
       FIND BY UNIQUE IDENTIFIERS
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
     * Create new teacher entity.
     */
    async create(dto: CreateTeacherDTO): Promise<Teacher> {
        const created = await prisma.teacher.create({
            data: this.buildPayload(dto),
            include: teacherInclude,
        });

        return TeacherMapper.toDomain(created);
    }

    /* =========================================================
       UPDATE
    ========================================================= */
    /**
     * Update teacher and handle homeroom reassignment safely.
     * Wrapped in transaction for atomic consistency.
     */
    async update(dto: UpdateTeacherDTO): Promise<Teacher> {
        return prisma.$transaction(async (tx) => {

            const updated = await tx.teacher.update({
                where: { id: dto.id },
                data: this.buildPayload(dto),
                include: teacherInclude,
            });

            if (dto.homeroomClassId !== undefined) {
                await tx.class.updateMany({
                    where: { homeroomTeacherId: dto.id },
                    data: { homeroomTeacherId: null },
                });

                if (dto.homeroomClassId) {
                    await tx.class.update({
                        where: { id: dto.homeroomClassId },
                        data: { homeroomTeacherId: dto.id },
                    });
                }
            }

            return TeacherMapper.toDomain(updated);
        });
    }

    /* =========================================================
       UPDATE ROLES
    ========================================================= */
    /**
     * Replace teacher roles.
     */
    async updateRoles(id: string, roles: string[]): Promise<Teacher> {
        const row = await prisma.teacher.update({
            where: { id },
            data: { roles: roles as TeacherRole[] },
            include: teacherInclude,
        });

        return TeacherMapper.toDomain(row);
    }

    /* =========================================================
       ASSIGN HOMEROOM
    ========================================================= */
    /**
     * Assign teacher as homeroom teacher for a class.
     */
    async assignHomeroom(
        teacherId: string,
        classId: string
    ): Promise<void> {
        await prisma.class.update({
            where: { id: classId },
            data: { homeroomTeacherId: teacherId },
        });
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
                orderBy: this.buildOrderBy(
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

    /* =========================================================
       BULK CREATE
    ========================================================= */
    /**
     * High-performance bulk insert.
     * Optimized for 100k+ records.
     */
    async bulkCreate(data: CreateTeacherDTO[]): Promise<void> {
        if (!data.length) return;

        await prisma.teacher.createMany({
            data: data.map((dto) => this.buildPayload(dto)),
            skipDuplicates: true,
        });
    }

    /* =========================================================
       EXPORT
    ========================================================= */
    /**
     * Retrieve all teachers for export (no pagination).
     */
    async findAllForExport(): Promise<ReadonlyArray<Teacher>> {
        const rows = await prisma.teacher.findMany({
            include: teacherInclude,
            orderBy: { createdAt: "desc" },
        });

        return TeacherMapper.toDomainList(rows);
    }
}
