//Files: src/modules/student/domain/mapper/StudentMapper.ts

import type { Prisma } from "@/generated/prisma";
import { StudentEntity } from "@/modules/student/domain/entity/Student";

type StudentRow = Prisma.StudentGetPayload<{}>;

export class StudentMapper {
  static toDomain(row: StudentRow): StudentEntity {
    return new StudentEntity(
      row.id,

      row.nis,
      row.nisn,

      row.name,
      row.nickname,
      row.gender,
      row.photo,

      row.birthPlace,
      row.birthDate,

      row.address,
      row.phone,
      row.email,

      row.religionCode,

      row.nik,
      row.kkNumber,

      row.schoolOrigin,
      row.graduationScore,

      row.instagram,

      row.familyStatus,

      row.isDifable,
      row.difableNotes,

      row.createdAt,
      row.deletedAt
    );
  }

  static toDomainList(rows: StudentRow[]): StudentEntity[] {
    return rows.map(StudentMapper.toDomain);
  }
}
