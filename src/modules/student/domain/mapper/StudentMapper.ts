//Files: src/modules/student/domain/mapper/StudentMapper.ts
import { GenderMapper } from "@/modules/student/domain/mapper/GenderMapper";
import { StudentStatusMapper } from "@/modules/student/domain/mapper/StudentStatusMapper";
import { Student } from "@/modules/student/domain/entity/Student";
import type { Student as PrismaStudent } from "@/generated/prisma";
import {FamilyStatusMapper} from "@/modules/student/domain/mapper/FamilyStatusMapper";

/**
 * Mapper: Prisma → Domain
 * Tidak ada logic bisnis
 */

export const StudentMapper = {
    toDomain(row: PrismaStudent): Student {
        return new Student(
            row.id,
            row.nis ?? null,
            row.nisn,
            row.name,
            row.nickname ?? null,
            GenderMapper.toDomain(row.gender),
            row.religionCode,
            row.rombelId,
            StudentStatusMapper.toDomain(row.status),
            FamilyStatusMapper.toDomain(row.familyStatus), // ✅ FIXED
            row.isDifable ?? false,
            row.difableNotes ?? null,
            row.deletedAt ?? null,
        );
    },

    toDomainList(rows: PrismaStudent[]): Student[] {
        return rows.map((row) => StudentMapper.toDomain(row));
    },
};
