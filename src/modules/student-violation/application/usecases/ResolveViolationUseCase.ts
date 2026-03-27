// Files: src/modules/student-violation/application/usecases/ResolveViolationUseCase.ts

import { BaseUseCase }
    from "@/modules/shared/core/BaseUseCase"

import { AppError }
    from "@/modules/shared/errors/AppError"

import { ResolveViolationDTO }
    from "@/modules/student-violation/domain/dto/ResolveViolationDTO"

import { StudentViolationInterface }
    from "@/modules/student-violation/domain/interfaces/StudentViolationInterface"

/**
 * ============================================================
 * RESOLVE VIOLATION USE CASE
 * ============================================================
 *
 * Updates the resolution status of a violation and
 * registers disciplinary action.
 */
export class ResolveViolationUseCase
    extends BaseUseCase<ResolveViolationDTO, void> {

    constructor(
        private readonly repo: StudentViolationInterface
    ) {
        super()
    }

    protected async handle(
        dto: ResolveViolationDTO
    ): Promise<void> {

        const violation =
            await this.repo.findById(dto.violationId)

        if (!violation) {
            throw new AppError("Violation not found")
        }

        if (violation.isResolved()) {
            throw new AppError("Violation already resolved")
        }

        await this.repo.resolveViolation(
            dto.violationId,
            dto.handlerTeacherId,
            dto.status,
            dto.action,
            dto.note
        )

    }

}