//Files: src/modules/student/application/usecases/BatchAssignStudentToRombelUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { BatchAssignStudentToRombelDTO } from "@/modules/student/domain/dto/BatchAssignStudentToRombelDTO";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * BATCH ASSIGN STUDENT TO ROMBEL USE CASE
 * ============================================================
 *
 * Purpose:
 * - Assign multiple students to a rombel.
 *
 * Returns:
 * - Number of affected rows
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for validation
 * - No manual Result wrapping
 */
export class BatchAssignStudentToRombelUseCase extends BaseUseCase<
    BatchAssignStudentToRombelDTO,
    number
> {
    constructor(private readonly repo: StudentInterface) {
        super();
    }

    protected async handle(
        dto: BatchAssignStudentToRombelDTO
    ): Promise<number> {
        const { studentIds, rombelId } = dto;

        if (!studentIds || studentIds.length === 0) {
            throw AppError.badRequest("Student IDs are required");
        }

        if (!rombelId) {
            throw AppError.badRequest("Rombel ID is required");
        }

        return this.repo.batchAssignToRombel(
            studentIds,
            rombelId
        );
    }
}