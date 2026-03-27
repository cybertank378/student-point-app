// Files: src/modules/student-violation/application/usecases/ListStudentViolationUseCase.ts

import { BaseUseCase }
    from "@/modules/shared/core/BaseUseCase"

import { StudentViolation }
    from "@/modules/student-violation/domain/entity/StudentViolation"

import { StudentViolationInterface }
    from "@/modules/student-violation/domain/interfaces/StudentViolationInterface"

/**
 * ============================================================
 * LIST STUDENT VIOLATION USE CASE
 * ============================================================
 *
 * Retrieves violations belonging to a student.
 */
export class ListStudentViolationUseCase
    extends BaseUseCase<string, StudentViolation[]> {

    constructor(
        private readonly repo: StudentViolationInterface
    ) {
        super()
    }

    protected async handle(
        studentId: string
    ): Promise<StudentViolation[]> {

        return this.repo.findByStudentId(studentId)

    }

}