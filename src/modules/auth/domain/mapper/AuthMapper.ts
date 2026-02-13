//Files: src/modules/auth/domain/mapper/AuthMapper.ts
// src/modules/auth/domain/mapper/AuthMapper.ts
// src/modules/auth/domain/mapper/AuthMapper.ts

import type {
    User as PrismaUser,
    AuthSession as PrismaAuthSession,
    PasswordResetToken as PrismaResetToken,
    TeacherRole as PrismaTeacherRole,
} from "@/generated/prisma";

import { AuthUser } from "@/modules/auth/domain/entity/AuthUser";
import { AuthSession } from "@/modules/auth/domain/entity/AuthSession";
import { PasswordResetToken } from "@/modules/auth/domain/entity/PasswordResetToken";

/**
 * User with teacher relation
 */
export type UserWithRelations = PrismaUser & {
    teacher?: {
        roles: PrismaTeacherRole[];
    } | null;
};

export class AuthMapper {
    static toDomainUser(data: UserWithRelations): AuthUser {
        const teacherRole: PrismaTeacherRole | undefined =
            data.teacher?.roles?.length
                ? data.teacher.roles[0]
                : undefined;

        return new AuthUser(
            data.id,
            data.username,
            data.password,
            data.role,
            teacherRole, // sekarang type-safe
            data.isActive,
            data.failedAttempts,
            data.lockUntil,
            data.mustChangePassword,
        );
    }

    static toDomainSession(
        data: PrismaAuthSession
    ): AuthSession {
        return new AuthSession(
            data.id,
            data.userId,
            data.tokenHash,
            data.expiresAt,
            data.revoked,
        );
    }

    static toDomainResetToken(
        data: PrismaResetToken
    ): PasswordResetToken {
        return new PasswordResetToken(
            data.id,
            data.userId,
            data.tokenHash,
            data.expiresAt,
            data.used,
        );
    }
}
