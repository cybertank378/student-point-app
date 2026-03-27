//Files: src/modules/student-profile/application/usecase/GetStudentProfileUseCase.ts

import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import {AppError} from "@/modules/shared/errors/AppError";
import {StudentCompositeDTO} from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import {StudentCompositeInterface} from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface";

/**
 * ============================================================
 * GET STUDENT PROFILE USE CASE
 * ============================================================
 *
 * Uses a student-composite read model.
 *
 * Business Rules:
 * - studentId must exist
 */

export class GetStudentProfileUseCase
    extends BaseUseCase<string, StudentCompositeDTO | null> {

    constructor(
        private readonly compositeRepo: StudentCompositeInterface
    ) {
        super()
    }

    protected async handle(
        studentId: string
    ): Promise<StudentCompositeDTO | null> {

        if (!studentId) {
            throw AppError.validation(
                "Student id is required"
            )
        }

        return this.compositeRepo.findById(studentId)

    }

}