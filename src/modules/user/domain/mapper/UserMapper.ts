// Files: src/modules/user/domain/mapper/UserMapper.ts

import type { Prisma } from "@/generated/prisma";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type { TeacherRole, UserRole } from "@/libs/utils";

/**
 * Prisma payload shape including related entities.
 */
export type UserWithRelations = Prisma.UserGetPayload<{
    select: {
        id: true;
        username: true;
        password: true;
        image: true;
        role: true;
        teacherRole: true;

        studentId: true;
        parentId: true;
        teacherId: true; // ✅ NEW

        isActive: true;
        lockUntil: true;
        failedAttempts: true;
        version: true;
        createdAt: true;
        updatedAt: true;

        student: {
            select: {
                id: true;
                name: true;
                nis: true;
                nisn: true;
                parents: {
                    select: {
                        role: true;
                        parent: {
                            select: {
                                id: true;
                                name: true;
                                phone: true;
                            };
                        };
                    };
                };
            };
        };

        parent: {
            select: {
                id: true;
                name: true;
                phone: true;
                students: {
                    select: {
                        role: true;
                        student: {
                            select: {
                                id: true;
                                name: true;
                                nis: true;
                                nisn: true;
                            };
                        };
                    };
                };
            };
        };

        teacher: {
            select: {
                id: true;
                name: true;
                nip: true;
                nrk: true;
            };
        };
    };
}>;

/**
 * Maps Prisma User model to Domain UserEntity.
 */
export const UserMapper = {
    toDomain(user: UserWithRelations): UserEntity {
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            image: user.image,

            role: user.role as UserRole,
            teacherRole: user.teacherRole as TeacherRole | null,

            studentId: user.studentId,
            parentId: user.parentId,
            teacherId: user.teacherId, // ✅ NEW

            isActive: user.isActive,
            lockUntil: user.lockUntil,
            failedAttempts: user.failedAttempts,
            version: user.version,

            // =============================
            // STUDENT PROFILE
            // =============================
            student: user.student
                ? {
                    id: user.student.id,
                    name: user.student.name,
                    nis: user.student.nis,
                    nisn: user.student.nisn,
                    parents: user.student.parents.map((sp) => ({
                        id: sp.parent.id,
                        name: sp.parent.name,
                        phone: sp.parent.phone,
                        role: sp.role,
                    })),
                }
                : null,

            // =============================
            // PARENT PROFILE
            // =============================
            parent: user.parent
                ? {
                    id: user.parent.id,
                    name: user.parent.name,
                    phone: user.parent.phone,
                    students: user.parent.students.map((sp) => ({
                        id: sp.student.id,
                        name: sp.student.name,
                        nis: sp.student.nis,
                        nisn: sp.student.nisn,
                        role: sp.role,
                    })),
                }
                : null,

            // =============================
            // TEACHER PROFILE
            // =============================
            teacher: user.teacher
                ? {
                    id: user.teacher.id,
                    name: user.teacher.name,
                    nip: user.teacher.nip,
                    nrk: user.teacher.nrk,
                }
                : null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    toDomainList(users: UserWithRelations[]): UserEntity[] {
        return users.map((user) => this.toDomain(user));
    },
};
