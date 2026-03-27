// Files: src/modules/student-violation/domain/mapper/ViolationActionLogMapper.ts

import { ViolationActionLog }
    from "@/modules/student-violation/domain/entity/ViolationActionLog"

/**
 * ============================================================
 * VIOLATION ACTION LOG MAPPER
 * ============================================================
 */
export class ViolationActionLogMapper {

    static toDomain(row: {
        id: string
        resolutionId: string
        action: string
        note: string | null
        createdAt: Date
    }): ViolationActionLog {

        return new ViolationActionLog(
            row.id,
            row.resolutionId,
            row.action,
            row.note,
            row.createdAt
        )

    }

}