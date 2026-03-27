// Files: src/modules/student-point/application/usecases/GetStudentPointSummaryUseCase.ts

import { AppError } from "@/modules/shared/errors/AppError";
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import { StudentPointDTO } from "@/modules/student-point/domain/dto/StudentPointDTO";
import { StudentPointInterface } from "@/modules/student-point/domain/interfaces/StudentPointInterface";
import { StudentPointMapper } from "@/modules/student-point/domain/mapper/StudentPointMapper";

/**
 * ============================================================
 * GET STUDENT POINT SUMMARY USE CASE
 * ============================================================
 *
 * Retrieve student point summary for a specific
 * student within an academic year.
 *
 * Business Rules:
 * - studentId must exist
 * - academicYearId must exist
 * - summary must exist
 */

export class GetStudentPointSummaryUseCase
    extends BaseUseCase<
        {
            studentId: string;
            academicYearId: string;
        },
        StudentPointDTO
    > {

    constructor(
        private readonly repo: StudentPointInterface
    ) {
        super();
    }

    protected async handle(
        dto: {
            studentId: string;
            academicYearId: string;
        }
    ): Promise<StudentPointDTO> {

        if (!dto.studentId) {
            throw AppError.validation("Student id is required");
        }

        if (!dto.academicYearId) {
            throw AppError.validation("Academic year id is required");
        }

        const summary =
            await this.repo.findByStudentAndAcademicYear(
                dto.studentId,
                dto.academicYearId
            );

        if (!summary) {
            throw AppError.notFound(
                "Student point summary not found"
            );
        }

        return StudentPointMapper.toDTO(summary);

    }

}