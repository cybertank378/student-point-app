//Files: src/modules/user/infrastructure/repo/UserRepository.ts
import {UserEntity} from "@/modules/user/domain/entity/UserEntity";
import prisma from "@/libs/prisma";
import { Prisma } from "@/generated/prisma";
import type {
    UpdateUserData,
    UserInterface,
    UserSearchParams,
    UserSearchResult
} from "@/modules/user/domain/interfaces/UserInterface";
import {UserMapper} from "@/modules/user/domain/mapper/UserMapper";
import type {UserRole, TeacherRole} from "@/libs/utils";

//
// ======================================================
// REUSABLE SELECT (SINGLE SOURCE OF TRUTH)
// ======================================================
//

const userSelect = {
    id: true,
    username: true,
    password: true,
    image: true,
    role: true,
    teacherRole: true,
    studentId: true,
    parentId: true,
    version: true,
    lockUntil: true,
    failedAttempts: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,

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

    teacher: {
        select: {
            id: true,
            name: true,
            nip: true,
        },
    },
} satisfies Prisma.UserSelect;

//
// ======================================================
// REPOSITORY IMPLEMENTATION
// ======================================================
//

export class UserRepository implements UserInterface {

    //
    // ======================================================
    // FIND ALL ACTIVE USERS
    // ======================================================
    //
    async findAll(): Promise<ReadonlyArray<UserEntity>> {
        const users = await prisma.user.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            select: userSelect,
        });

        return UserMapper.toDomainList(users);
    }

    //
    // ======================================================
    // FIND BY ID
    // ======================================================
    //
    async findById(id: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: userSelect,
        });

        return user ? UserMapper.toDomain(user) : null;
    }

    //
    // ======================================================
    // CREATE USER
    // ======================================================
    //
    async create(data: {
        username: string;
        password: string;
        role: UserRole;
        teacherRole?: TeacherRole | null;
        studentId?: string | null;
        parentId?: string | null;
    }): Promise<UserEntity> {

        const user = await prisma.user.create({
            data: {
                username: data.username,
                password: data.password,
                role: data.role,
                teacherRole: data.teacherRole ?? null,
                studentId: data.studentId ?? null,
                parentId: data.parentId ?? null,
            },
            select: userSelect,
        });

        return UserMapper.toDomain(user);
    }

    //
    // ======================================================
    // UPDATE USER
    // ======================================================
    //
    async update(id: string, data: UpdateUserData): Promise<UserEntity> {
        const updated = await prisma.user.update({
            where: { id },
            data,
            select: userSelect,
        });

        return UserMapper.toDomain(updated);
    }

    //
    // ======================================================
    // DELETE USER (HARD DELETE)
    // ======================================================
    //
    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }

    //
    // ======================================================
    // PAGINATED LIST
    // ======================================================
    //
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

    //
    // ======================================================
    // STATS
    // ======================================================
    //
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

    //
    // ======================================================
    // ADVANCED SEARCH
    // ======================================================
    //
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
