// Files: src/modules/student-violation/application/usecases/GetViolationHistoryUseCase.ts

import { BaseUseCase }
    from "@/modules/shared/core/BaseUseCase"

import { AppError }
    from "@/modules/shared/errors/AppError"

import { StudentViolation }
    from "@/modules/student-violation/domain/entity/StudentViolation"

import { StudentViolationInterface }
    from "@/modules/student-violation/domain/interfaces/StudentViolationInterface"

import { StudentCompositeInterface }
    from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface"

import { ViolationHistoryQuery }
    from "@/modules/student-violation/domain/dto/ViolationHistoryQuery"

/**
 * ============================================================
 * GET VIOLATION HISTORY USE CASE
 * ============================================================
 *
 * Retrieves violation history of a specific student
 * within a given academic year.
 *
 * Responsibilities
 * - Validate student existence through StudentComposite
 * - Validate academic year identifier
 * - Retrieve violation records from repository
 * - Guarantee domain integrity of returned records
 * - Ensure violations belong to the requested student
 */

export class GetViolationHistoryUseCase
    extends BaseUseCase<
        ViolationHistoryQuery,
        StudentViolation[]
    > {

    constructor(
        private readonly repo: StudentViolationInterface,
        private readonly studentCompositeRepo: StudentCompositeInterface
    ) {
        super()
    }

    protected async handle(
        query: ViolationHistoryQuery
    ): Promise<StudentViolation[]> {

        const student =
            await this.studentCompositeRepo.findById(
                query.studentId
            )

        if (!student) {
            throw new AppError(
                "Student not found"
            )
        }

        if (!query.academicYearId) {
            throw new AppError(
                "Academic year identifier is required"
            )
        }

        const violations =
            await this.repo.findByAcademicYear(
                query.studentId,
                query.academicYearId
            )

        if (violations.length === 0) {
            return []
        }

        for (const violation of violations) {

            if (violation.studentId !== query.studentId) {
                throw new AppError(
                    "Violation record integrity error"
                )
            }

        }

        return violations

    }

}