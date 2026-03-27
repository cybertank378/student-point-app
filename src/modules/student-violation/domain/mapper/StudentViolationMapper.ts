//Files: src/modules/student-violation/domain/mapper/StudentViolationMapper.ts

import { StudentViolation }
    from "@/modules/student-violation/domain/entity/StudentViolation"

/**
 * ============================================================
 * STUDENT VIOLATION MAPPER
 * ============================================================
 *
 * Converts persistence records into domain entities.
 */
export class StudentViolationMapper {

    static toDomain(row: {
        id: string
        studentId: string
        violationId: string
        academicYearId: string
        point: number
        occurredAt: Date
        createdAt: Date
    }): StudentViolation {

        return StudentViolation.reconstitute(
            row.id,
            row.studentId,
            row.violationId,
            row.academicYearId,
            row.point,
            row.occurredAt,
            row.createdAt,
            null
        )

    }

}