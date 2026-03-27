//Files: src/modules/student-profile/application/usecase/DeleteStudentProfileUseCase.ts
// src/modules/student-profile/application/usecases/DeleteStudentProfileUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"
import { AppError } from "@/modules/shared/errors/AppError"
import {StudentProfileInterface} from "@/modules/student-profile/domain/interfaces/StudentProfileInterface";


/**
 * ============================================================
 * DELETE STUDENT PROFILE USE CASE
 * ============================================================
 *
 * Business Rules:
 * - studentId must exist
 * - profile must exist
 * - deletion executed atomically
 */

export class DeleteStudentProfileUseCase
    extends BaseUseCase<string, void> {

    constructor(
        private readonly repo: StudentProfileInterface
    ) {
        super()
    }

    protected async handle(
        studentId: string
    ): Promise<void> {

        if (!studentId) {
            throw AppError.validation("Student id is required")
        }

        return this.repo.withTransaction(async () => {

            const profile =
                await this.repo.findByStudentId(studentId)

            if (!profile) {
                throw AppError.notFound(
                    "Student profile not found"
                )
            }

            await this.repo.delete(studentId)

        })

    }

}