//Files: src/modules/student/domain/mapper/StudentMapper.ts
import { GenderMapper } from "@/modules/student/domain/mapper/GenderMapper";
import { StudentStatusMapper } from "@/modules/student/domain/mapper/StudentStatusMapper";
import { Student } from "@/modules/student/domain/entity/Student";
import type { Student as PrismaStudent } from "@/generated/prisma";

/**
 * Mapper: Prisma → Domain
 * Tidak ada logic bisnis
 */
export const StudentMapper = {
  toDomain(row: PrismaStudent): Student {
    return new Student(
      row.id,
      row.nis,
      row.nisn,
      row.name,
      row.nickname ?? null,
      GenderMapper.toDomain(row.gender),
      row.religionCode,
      row.rombelId,
      StudentStatusMapper.toDomain(row.status),
      row.deletedAt,
    );
  },

  toDomainList(rows: PrismaStudent[]): Student[] {
    return rows.map(StudentMapper.toDomain);
  },
};
