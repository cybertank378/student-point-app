//Files: src/modules/user/domain/mapper/UserMapper.ts
import type { Prisma } from "@/generated/prisma";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type { TeacherRole, UserRole } from "@/libs/utils";

//
// ======================================================
// PRISMA TYPE (SELECT SHAPE)
// ======================================================
//

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
        isActive: true;
        lockUntil: true;
        failedAttempts: true;
        version: true;
        createdAt: true;
        updatedAt: true;

        // STUDENT RELATION
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

        // PARENT RELATION
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

        // TEACHER RELATION
        teacher: {
            select: {
                id: true;
                name: true;
                nip: true;
            };
        };
    };
}>;

//
// ======================================================
// MAPPER
// ======================================================
//

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
            isActive: user.isActive,
            lockUntil: user.lockUntil,
            failedAttempts: user.failedAttempts,
            version: user.version,

            // =============================
            // STUDENT
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
            // PARENT
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
            // TEACHER
            // =============================
            teacher: user.teacher
                ? {
                    id: user.teacher.id,
                    name: user.teacher.name,
                    nip: user.teacher.nip,
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
