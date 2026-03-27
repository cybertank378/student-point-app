//Files: src/modules/student-profile/application/usecase/UpdateStudentProfileUseCase.ts

import {AppError} from "@/modules/shared/errors/AppError";
import {StudentProfileDTO} from "@/modules/student-profile/domain/dto/StudentProfileDTO";
import {UpdateStudentProfileDTO} from "@/modules/student-profile/domain/dto/UpdateStudentProfileDTO";
import {StudentProfileInterface} from "@/modules/student-profile/domain/interfaces/StudentProfileInterface";
import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";

/**
 * ============================================================
 * UPDATE STUDENT PROFILE USE CASE
 * ============================================================
 *
 * Business Rules:
 * - studentId must exist
 * - profile must exist before update
 * - update executed atomically
 */

export class UpdateStudentProfileUseCase
    extends BaseUseCase<UpdateStudentProfileDTO, StudentProfileDTO> {

    constructor(
        private readonly repo: StudentProfileInterface
    ) {
        super()
    }

    protected async handle(
        dto: UpdateStudentProfileDTO
    ): Promise<StudentProfileDTO> {

        if (!dto.studentId) {
            throw AppError.validation("Student id is required")
        }

        return this.repo.withTransaction(async () => {

            const profile =
                await this.repo.findByStudentId(dto.studentId)

            if (!profile) {
                throw AppError.notFound(
                    "Student profile not found"
                )
            }

            return this.repo.update(dto)

        })

    }

}