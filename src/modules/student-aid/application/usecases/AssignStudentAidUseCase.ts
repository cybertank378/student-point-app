//Files: src/modules/student-aid/application/usecases/AssignStudentAidUseCase.ts
import {AppError} from "@/modules/shared/errors/AppError";
import {StudentAidDTO} from "@/modules/student-aid/domain/dto/StudentAidDTO";
import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import {StudentAidInterface} from "@/modules/student-aid/domain/interfaces/StudentAidInterface";

/**
 * ============================================================
 * ASSIGN STUDENT AID USE CASE
 * ============================================================
 *
 * Assign government aid to a student
 * within a specific academic year.
 *
 * Business Rules:
 * - studentId must exist
 * - academicYearId must exist
 * - aid must be unique per academic year
 * - operation executed atomically
 */

export class AssignStudentAidUseCase
    extends BaseUseCase<
        Omit<StudentAidDTO, "id">,
        StudentAidDTO
    > {

    constructor(
        private readonly repo: StudentAidInterface
    ) {
        super();
    }

    protected async handle(
        dto: Omit<StudentAidDTO, "id">
    ): Promise<StudentAidDTO> {

        if (!dto.studentId) {
            throw AppError.validation("Student id is required");
        }

        if (!dto.academicYearId) {
            throw AppError.validation("Academic year id is required");
        }

        return this.repo.withTransaction(async () => {

            const existing =
                await this.repo.findByStudentAndYear(
                    dto.studentId,
                    dto.academicYearId
                );

            if (existing) {
                throw AppError.conflict(
                    "Student aid already exists for this academic year"
                );
            }

            return this.repo.assign(dto);

        });

    }

}