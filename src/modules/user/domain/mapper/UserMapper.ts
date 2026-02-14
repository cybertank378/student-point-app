//Files: src/modules/user/domain/mapper/UserMapper.ts
import type { User as PrismaUser } from "@/generated/prisma";
import { User } from "@/modules/user/domain/entity/User";

/**
 * Mapper: Prisma → Domain
 * Tidak ada logic bisnis
 */
export const UserMapper = {
  toDomain(row: PrismaUser): User {
    return new User(
      row.id,
      row.username,
      row.password,
      row.role,
      row.isActive,
      row.failedAttempts,
      row.lockUntil,
      row.mustChangePassword,
      row.createdAt,
      row.updatedAt,
    );
  },

  toDomainList(rows: PrismaUser[]): User[] {
    return rows.map(UserMapper.toDomain);
  },
};
