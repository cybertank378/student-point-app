// Files: src/modules/student-point/application/usecases/ListStudentPointSummaryUseCase.ts

import { AppError } from "@/modules/shared/errors/AppError";
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import { StudentPointDTO } from "@/modules/student-point/domain/dto/StudentPointDTO";
import { StudentPointInterface } from "@/modules/student-point/domain/interfaces/StudentPointInterface";
import { StudentPointMapper } from "@/modules/student-point/domain/mapper/StudentPointMapper";

/**
 * ============================================================
 * LIST STUDENT POINT SUMMARY USE CASE
 * ============================================================
 *
 * Retrieve all student point summaries
 * within a specific academic year.
 *
 * Used for:
 *
 * - student ranking
 * - discipline monitoring
 * - school reports
 */

export class ListStudentPointSummaryUseCase
    extends BaseUseCase<
        {
            academicYearId: string;
        },
        StudentPointDTO[]
    > {

    constructor(
        private readonly repo: StudentPointInterface
    ) {
        super();
    }

    protected async handle(
        dto: {
            academicYearId: string;
        }
    ): Promise<StudentPointDTO[]> {

        if (!dto.academicYearId) {
            throw AppError.validation("Academic year id is required");
        }

        const summaries =
            await this.repo.listByAcademicYear(
                dto.academicYearId
            );

        return summaries.map(
            (summary) => StudentPointMapper.toDTO(summary)
        );

    }

}