//Files: src/modules/student/application/usecases/AssignStudentToRombelUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { AssignStudentToRombelDTO } from "@/modules/student/domain/dto/AssignStudentToRombelDTO";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * ASSIGN STUDENT TO ROMBEL USE CASE
 * ============================================================
 *
 * Purpose:
 * - Assign student to a rombel.
 *
 * Business Rules:
 * - studentId must be provided
 * - rombelId must be provided
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class AssignStudentToRombelUseCase extends BaseUseCase<
    AssignStudentToRombelDTO,
    void
> {
    constructor(private readonly repo: StudentInterface) {
        super();
    }

    protected async handle(dto: AssignStudentToRombelDTO): Promise<void> {
        const { studentId, rombelId } = dto;

        if (!studentId || !rombelId) {
            throw AppError.badRequest("Student ID or Rombel ID is required");
        }

        await this.repo.assignToRombel(studentId, rombelId);
    }
}