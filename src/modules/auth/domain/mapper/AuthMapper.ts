//Files: src/modules/auth/domain/mapper/AuthMapper.ts
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

/**
 * Mapper: Prisma → Domain
 * Tidak ada logic bisnis
 */
export const AuthMapper = {
  /* ================= USER ================= */

  toDomainUser(row: UserWithRelations): AuthUser {
    const teacherRole: PrismaTeacherRole | undefined = row.teacher?.roles
      ?.length
      ? row.teacher.roles[0]
      : undefined;

    return new AuthUser(
      row.id,
      row.username,
      row.password,
      row.role,
      teacherRole,
      row.isActive,
      row.failedAttempts,
      row.lockUntil,
      row.mustChangePassword,
    );
  },

  toDomainUserList(rows: UserWithRelations[]): AuthUser[] {
    return rows.map(AuthMapper.toDomainUser);
  },

  /* ================= SESSION ================= */

  toDomainSession(row: PrismaAuthSession): AuthSession {
    return new AuthSession(
      row.id,
      row.userId,
      row.tokenHash,
      row.expiresAt,
      row.revoked,
    );
  },

  toDomainSessionList(rows: PrismaAuthSession[]): AuthSession[] {
    return rows.map(AuthMapper.toDomainSession);
  },

  /* ================= RESET TOKEN ================= */

  toDomainResetToken(row: PrismaResetToken): PasswordResetToken {
    return new PasswordResetToken(
      row.id,
      row.userId,
      row.tokenHash,
      row.expiresAt,
      row.used,
    );
  },

  toDomainResetTokenList(rows: PrismaResetToken[]): PasswordResetToken[] {
    return rows.map(AuthMapper.toDomainResetToken);
  },
};
