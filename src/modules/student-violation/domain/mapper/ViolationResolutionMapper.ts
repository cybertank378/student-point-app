// Files: src/modules/student-violation/domain/mapper/ViolationResolutionMapper.ts

import { ViolationResolution }
    from "@/modules/student-violation/domain/entity/ViolationResolution"

/**
 * ============================================================
 * VIOLATION RESOLUTION MAPPER
 * ============================================================
 */
export class ViolationResolutionMapper {

    static toDomain(row: {
        id: string
        studentViolationId: string
        handlerTeacherId: string
        status: string
        action: string
        note: string | null
        resolvedAt: Date | null
        createdAt: Date
        updatedAt: Date
    }): ViolationResolution {

        return new ViolationResolution(
            row.id,
            row.studentViolationId,
            row.handlerTeacherId,
            row.status,
            row.action,
            row.note,
            row.resolvedAt,
            row.createdAt,
            row.updatedAt,
            []
        )

    }

}