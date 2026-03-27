//Files: src/modules/student-aid/application/usecases/UpdateStudentAidUseCase.ts

import {StudentAidInterface} from "@/modules/student-aid/domain/interfaces/StudentAidInterface";
import {StudentAidDTO} from "@/modules/student-aid/domain/dto/StudentAidDTO";
import {AppError} from "@/modules/shared/errors/AppError";
import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";

/**
 * ============================================================
 * UPDATE STUDENT AID USE CASE
 * ============================================================
 *
 * Update existing student aid configuration.
 *
 * Business Rules:
 * - aid must exist
 * - update executed atomically
 */

export class UpdateStudentAidUseCase extends BaseUseCase<StudentAidDTO, StudentAidDTO> {

    constructor(
        private readonly repo: StudentAidInterface
    ) {
        super();
    }

    protected async handle(
        dto: StudentAidDTO
    ): Promise<StudentAidDTO> {

        return this.repo.withTransaction(async () => {

            const existing =
                await this.repo.findByStudentAndYear(
                    dto.studentId,
                    dto.academicYearId
                );

            if (!existing) {
                throw AppError.notFound(
                    "Student aid record not found"
                );
            }

            return this.repo.update(dto);

        });

    }

}