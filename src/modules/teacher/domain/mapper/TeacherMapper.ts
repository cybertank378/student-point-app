//Files: src/modules/teacher/domain/mapper/TeacherMapper.ts
import { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { Prisma } from "@/generated/prisma";

type TeacherRow = Prisma.TeacherGetPayload<{
    include: {
        religion: true;
        homeroomOf: true;
    };
}>;

/**
 * ============================================================
 * TEACHER MAPPER
 * ============================================================
 *
 * Responsible for transforming persistence model
 * (Prisma) → Domain Entity.
 */
export class TeacherMapper {
    /**
     * Convert single Prisma row into Domain Entity.
     */
    static toDomain(row: TeacherRow): Teacher {
        return new Teacher(
            row.id,
            row.nip,
            row.nuptk,
            row.nrk,
            row.nrg,
            row.name,
            row.gender,
            row.religionCode,
            row.phone,
            row.email,
            row.photo,
            row.educationLevel,
            row.major,
            row.graduationYear,
            row.birthPlace,
            row.birthDate,
            row.civilServantRank,
            row.roles,
            row.homeroomOf.map((c) => c.id),
            row.isPns
        );
    }

    /**
     * Convert multiple rows into Domain Entities.
     */
    static toDomainList(rows: TeacherRow[]): Teacher[] {
        return rows.map(TeacherMapper.toDomain);
    }
}
