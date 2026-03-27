// Files: src/modules/student-violation/domain/builder/StudentViolationBuilder.ts

import { StudentViolation }
    from "@/modules/student-violation/domain/entity/StudentViolation"

import { StudentViolationMapper }
    from "@/modules/student-violation/domain/mapper/StudentViolationMapper"

import { ViolationResolutionMapper }
    from "@/modules/student-violation/domain/mapper/ViolationResolutionMapper"

import { ViolationActionLogMapper }
    from "@/modules/student-violation/domain/mapper/ViolationActionLogMapper"

/**
 * ============================================================
 * STUDENT VIOLATION BUILDER
 * ============================================================
 *
 * Responsible for reconstructing the StudentViolation
 * aggregate from persistence records.
 *
 * Architectural Role
 * - Domain Builder
 * - Aggregate Reconstitution
 *
 * Responsibilities
 * - Build StudentViolation aggregate root
 * - Attach ViolationResolution entity
 * - Attach ViolationActionLog collection
 *
 * Design Principles
 * - SRP
 * - Domain reconstruction logic isolated from repository
 * - Prevent infrastructure coupling
 */
export class StudentViolationBuilder {

    /**
     * Builds a StudentViolation aggregate
     * from persistence data.
     */
    static build(
        row: {
            id: string
            studentId: string
            violationId: string
            academicYearId: string
            point: number
            occurredAt: Date
            createdAt: Date
            resolution: {
                id: string
                studentViolationId: string
                handlerTeacherId: string
                status: string
                action: string
                note: string | null
                resolvedAt: Date | null
                createdAt: Date
                updatedAt: Date
                logs: {
                    id: string
                    resolutionId: string
                    action: string
                    note: string | null
                    createdAt: Date
                }[]
            } | null
        }
    ): StudentViolation {

        const violation =
            StudentViolationMapper.toDomain(row)

        if (row.resolution) {

            const resolution =
                ViolationResolutionMapper.toDomain(row.resolution)

            const logs =
                row.resolution.logs.map(
                    ViolationActionLogMapper.toDomain
                )

            resolution.attachLogs(logs)

            violation.attachResolution(resolution)

        }

        return violation

    }

}