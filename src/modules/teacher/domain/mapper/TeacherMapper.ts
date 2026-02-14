//Files: src/modules/teacher/domain/mapper/TeacherMapper.ts
import type {
  Teacher as PrismaTeacher,
  Class as PrismaClass,
} from "@/generated/prisma";
import { Teacher } from "@/modules/teacher/domain/entity/Teacher";

/**
 * Prisma type dengan relation homeroom
 */
type TeacherWithHomeroom = PrismaTeacher & {
  homeroomOf: PrismaClass | null;
};

/**
 * Mapper: Prisma → Domain
 * Tidak ada logic bisnis
 */
export const TeacherMapper = {
  toDomain(row: TeacherWithHomeroom): Teacher {
    return new Teacher(
      row.id,
      row.userId,
      row.nip,
      row.name,
      row.phone,
      row.email,
      row.roles,
      row.homeroomOf?.id ?? null,
    );
  },

  toDomainList(rows: TeacherWithHomeroom[]): Teacher[] {
    return rows.map(TeacherMapper.toDomain);
  },
};
