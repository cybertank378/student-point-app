// Files: src/modules/user/domain/mapper/UserMapper.ts

import type { Prisma } from "@/generated/prisma";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type { TeacherRole, UserRole } from "@/libs/utils";

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
        teacherId: true;

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
                nuptk: true;
                nrg: true;
            };
        };
    };
}>;

export const UserMapper = {
    toDomain(user: UserWithRelations): UserEntity {
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            image: user.image ?? null,

            role: user.role as UserRole,
            teacherRole: user.teacherRole as TeacherRole | null,

            studentId: user.studentId ?? null,
            parentId: user.parentId ?? null,
            teacherId: user.teacherId ?? null,

            isActive: user.isActive,
            lockUntil: user.lockUntil ?? null,
            failedAttempts: user.failedAttempts,
            version: user.version,

            student: user.student
                ? {
                    id: user.student.id,
                    name: user.student.name,
                    nis: user.student.nis ?? null,
                    nisn: user.student.nisn!, // 🔥 force non-null (karena DB harus NOT NULL)
                    parents: user.student.parents.map((sp) => ({
                        id: sp.parent.id,
                        name: sp.parent.name,
                        phone: sp.parent.phone,
                        role: sp.role.toString(), // 🔥 enum → string
                    })),
                }
                : null,

            parent: user.parent
                ? {
                    id: user.parent.id,
                    name: user.parent.name,
                    phone: user.parent.phone ?? null,
                    students: user.parent.students.map((sp) => ({
                        id: sp.student.id,
                        name: sp.student.name,
                        nis: sp.student.nis ?? null,
                        nisn: sp.student.nisn!, // 🔥 force non-null
                        role: sp.role.toString(), // 🔥 enum → string
                    })),
                }
                : null,

            teacher: user.teacher
                ? {
                    id: user.teacher.id,
                    name: user.teacher.name,
                    nip: user.teacher.nip ?? null,
                    nrk: user.teacher.nrk ?? null,
                    nuptk: user.teacher.nuptk ?? null,
                    nrg: user.teacher.nrg, // NOT NULL
                }
                : null,

            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    toDomainList(users: UserWithRelations[]): UserEntity[] {
        return users.map(this.toDomain);
    },
};