//Files: src/modules/student-aid/application/usecases/ListStudentAidUseCase.ts

import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import {StudentAidDTO} from "@/modules/student-aid/domain/dto/StudentAidDTO";
import {StudentAidInterface} from "@/modules/student-aid/domain/interfaces/StudentAidInterface";
import {AppError} from "@/modules/shared/errors/AppError";

/**
 * ============================================================
 * LIST STUDENT AID USE CASE
 * ============================================================
 *
 * Retrieve all aid records belonging to a specific student.
 *
 * This use case intentionally avoids using the
 * student-composite module to prevent over-fetching
 * of unrelated student aggregate data.
 *
 * Only StudentAid data will be retrieved.
 */

export class ListStudentAidUseCase
    extends BaseUseCase<
        string,
        ReadonlyArray<StudentAidDTO>
    > {

    constructor(
        private readonly repo: StudentAidInterface
    ) {
        super();
    }

    /**
     * Execute aid retrieval for a student.
     *
     * @param studentId - student identifier
     */
    protected async handle(
        studentId: string
    ): Promise<ReadonlyArray<StudentAidDTO>> {

        if (!studentId) {
            throw AppError.validation(
                "Student id is required"
            );
        }

        const aids =
            await this.repo.findByStudent(studentId);

        return aids;

    }
}
