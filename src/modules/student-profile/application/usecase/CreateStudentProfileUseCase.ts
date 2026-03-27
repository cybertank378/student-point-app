//Files: src/modules/student-profile/application/usecase/CreateStudentProfileUseCase.ts

import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import {CreateStudentProfileDTO} from "@/modules/student-profile/domain/dto/CreateStudentProfileDTO";
import {StudentProfileDTO} from "@/modules/student-profile/domain/dto/StudentProfileDTO";
import {StudentProfileInterface} from "@/modules/student-profile/domain/interfaces/StudentProfileInterface";
import {AppError} from "@/modules/shared/errors/AppError";

/**
 * ============================================================
 * CREATE STUDENT PROFILE USE CASE
 * ============================================================
 *
 * Business Rules:
 * - studentId must exist
 * - student must not yet have a profile
 * - profile creation must be atomic
 */

export class CreateStudentProfileUseCase
    extends BaseUseCase<CreateStudentProfileDTO, StudentProfileDTO> {

    constructor(
        private readonly repo: StudentProfileInterface
    ) {
        super();
    }

    protected async handle(
        dto: CreateStudentProfileDTO
    ): Promise<StudentProfileDTO> {

        if (!dto.studentId) {
            throw AppError.validation("Student id is required");
        }

        return this.repo.withTransaction(async () => {

            const existing =
                await this.repo.findByStudentId(dto.studentId);

            if (existing) {
                throw AppError.conflict(
                    "Student already has a profile"
                );
            }

            return this.repo.create(dto);

        });

    }

}