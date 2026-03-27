// Files: src/modules/student-violation/application/usecases/RecordViolationUseCase.ts

import { BaseUseCase }
    from "@/modules/shared/core/BaseUseCase"

import { AppError }
    from "@/modules/shared/errors/AppError"

import { StudentViolation }
    from "@/modules/student-violation/domain/entity/StudentViolation"

import { RecordViolationDTO }
    from "@/modules/student-violation/domain/dto/RecordViolationDTO"

import { StudentViolationInterface }
    from "@/modules/student-violation/domain/interfaces/StudentViolationInterface"

import { StudentCompositeInterface }
    from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface"

/**
 * ============================================================
 * RECORD VIOLATION USE CASE
 * ============================================================
 *
 * Records a disciplinary violation committed by a student.
 *
 * Responsibilities
 * - Validate student existence via StudentComposite
 * - Create StudentViolation aggregate
 * - Persist violation through repository
 */
export class RecordViolationUseCase
    extends BaseUseCase<RecordViolationDTO, StudentViolation> {

    constructor(
        private readonly repo: StudentViolationInterface,
        private readonly studentCompositeRepo: StudentCompositeInterface
    ) {
        super()
    }

    protected async handle(
        dto: RecordViolationDTO
    ): Promise<StudentViolation> {

        const student =
            await this.studentCompositeRepo.findById(dto.studentId)

        if (!student) {
            throw new AppError("Student not found")
        }

        const violation =
            StudentViolation.create(
                dto.studentId,
                dto.violationId,
                dto.academicYearId,
                dto.point,
                dto.occurredAt
            )

        await this.repo.save(violation)

        return violation

    }

}