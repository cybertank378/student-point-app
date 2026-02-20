//Files: src/modules/user/infrastructure/repo/UserRepository.ts
// Files: src/modules/user/infrastructure/repo/UserRepository.ts

import { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma";
import type {
    UpdateUserData,
    UserInterface,
    UserSearchParams,
    UserSearchResult,
} from "@/modules/user/domain/interfaces/UserInterface";
import { UserMapper } from "@/modules/user/domain/mapper/UserMapper";
import type { UserRole, TeacherRole } from "@/libs/utils";

//
// ======================================================
// PRISMA SELECT CONFIGURATION
// ------------------------------------------------------
// Single Source of Truth for User read operations.
// Ensures consistency between repository and mapper.
// Any relation or field addition must be reflected here.
// ======================================================
//

const userSelect = {
    id: true,
    username: true,
    password: true,
    image: true,

    // System roles
    role: true,
    teacherRole: true,

    // Foreign keys (profile linkage)
    studentId: true,
    parentId: true,
    teacherId: true,

    // Security & state control
    version: true,
    lockUntil: true,
    failedAttempts: true,
    isActive: true,

    createdAt: true,
    updatedAt: true,

    // --------------------------------------------------
    // STUDENT PROFILE RELATION
    // --------------------------------------------------
    student: {
        select: {
            id: true,
            name: true,
            nis: true,
            nisn: true,
            parents: {
                select: {
                    role: true,
                    parent: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                        },
                    },
                },
            },
        },
    },

    // --------------------------------------------------
    // PARENT PROFILE RELATION
    // --------------------------------------------------
    parent: {
        select: {
            id: true,
            name: true,
            phone: true,
            students: {
                select: {
                    role: true,
                    student: {
                        select: {
                            id: true,
                            name: true,
                            nis: true,
                            nisn: true,
                        },
                    },
                },
            },
        },
    },

    // --------------------------------------------------
    // TEACHER PROFILE RELATION
    // --------------------------------------------------
    teacher: {
        select: {
            id: true,
            name: true,
            nip: true,
            nrk: true,
        },
    },
} satisfies Prisma.UserSelect;

//
// ======================================================
// USER REPOSITORY IMPLEMENTATION
// ------------------------------------------------------
// Responsible for data persistence layer interaction.
// Converts Prisma models into Domain Entities via mapper.
// ======================================================
//

export class UserRepository implements UserInterface {

    /**
     * Retrieve all active users ordered by newest first.
     * Intended for admin overview.
     */
    async findAll(): Promise<ReadonlyArray<UserEntity>> {
        const users = await prisma.user.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            select: userSelect,
        });

        return UserMapper.toDomainList(users);
    }

    /**
     * Retrieve a single user by unique ID.
     * Returns null if user is not found.
     */
    async findById(id: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: userSelect,
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    /**
     * Create new system user.
     *
     * This method supports linking user account
     * to exactly one profile:
     * - studentId
     * - parentId
     * - teacherId
     *
     * Business layer must ensure only one is provided.
     */
    async create(data: {
        username: string;
        password: string;
        role: UserRole;
        teacherRole?: TeacherRole | null;
        studentId?: string | null;
        parentId?: string | null;
        teacherId?: string | null;
    }): Promise<UserEntity> {

        const user = await prisma.user.create({
            data: {
                username: data.username,
                password: data.password,
                role: data.role,
                teacherRole: data.teacherRole ?? null,

                studentId: data.studentId ?? null,
                parentId: data.parentId ?? null,
                teacherId: data.teacherId ?? null,
            },
            select: userSelect,
        });

        return UserMapper.toDomain(user);
    }

    /**
     * Update user account properties.
     * Supports partial update via UpdateUserData.
     */
    async update(id: string, data: UpdateUserData): Promise<UserEntity> {
        const updated = await prisma.user.update({
            where: { id },
            data,
            select: userSelect,
        });

        return UserMapper.toDomain(updated);
    }

    /**
     * Permanently delete user record.
     * Use cautiously (no soft delete here).
     */
    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }

    /**
     * Paginated listing for admin table view.
     * Supports optional keyword search.
     */
    async list(params: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<{ data: UserEntity[]; total: number }> {

        const { page, limit, search } = params;
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {
            isActive: true,
        };

        // Flexible keyword search
        if (search) {
            where.OR = [
                { username: { contains: search, mode: "insensitive" } },
                { student: { name: { contains: search, mode: "insensitive" } } },
                { parent: { name: { contains: search, mode: "insensitive" } } },
                { teacher: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: userSelect,
            }),
            prisma.user.count({ where }),
        ]);

        return {
            data: UserMapper.toDomainList(users),
            total,
        };
    }

    /**
     * Aggregated statistics for dashboard analytics.
     */
    async getUserStats(): Promise<{
        totalActiveUsers: number;
        totalStudentUsers: number;
        totalParentUsers: number;
        totalTeacherUsers: number;
    }> {

        const [
            totalActiveUsers,
            totalStudentUsers,
            totalParentUsers,
            totalTeacherUsers,
        ] = await Promise.all([
            prisma.user.count({ where: { isActive: true } }),
            prisma.user.count({ where: { isActive: true, role: "STUDENT" } }),
            prisma.user.count({ where: { isActive: true, role: "PARENT" } }),
            prisma.user.count({ where: { isActive: true, role: "TEACHER" } }),
        ]);

        return {
            totalActiveUsers,
            totalStudentUsers,
            totalParentUsers,
            totalTeacherUsers,
        };
    }

    /**
     * Advanced search with dynamic filtering.
     * Supports:
     * - Role filter
     * - Active status
     * - Teacher role
     * - Date range
     * - Sorting
     */
    async search(params: UserSearchParams): Promise<UserSearchResult> {

        const {
            page,
            limit,
            username,
            role,
            isActive,
            teacherRole,
            createdFrom,
            createdTo,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = params;

        const skip = (page - 1) * limit;
        const filters: Prisma.UserWhereInput[] = [];

        if (username) {
            filters.push({
                OR: [
                    { username: { startsWith: username, mode: "insensitive" } },
                    { student: { name: { startsWith: username, mode: "insensitive" } } },
                    { teacher: { name: { startsWith: username, mode: "insensitive" } } },
                    { parent: { name: { startsWith: username, mode: "insensitive" } } },
                ],
            });
        }

        if (role) filters.push({ role });
        if (typeof isActive === "boolean") filters.push({ isActive });
        if (teacherRole) filters.push({ teacherRole });

        if (createdFrom || createdTo) {
            filters.push({
                createdAt: {
                    ...(createdFrom && { gte: createdFrom }),
                    ...(createdTo && { lte: createdTo }),
                },
            });
        }

        const where: Prisma.UserWhereInput =
            filters.length > 0 ? { AND: filters } : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                select: userSelect,
            }),
            prisma.user.count({ where }),
        ]);

        return {
            data: UserMapper.toDomainList(users),
            total,
            page,
            limit,
        };
    }
}
