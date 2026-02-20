//Files: src/modules/student/application/usecases/DeleteStudentUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * DELETE STUDENT USE CASE
 * ============================================================
 *
 * Purpose:
 * - Soft delete student by ID.
 *
 * Business Rules:
 * - Student must exist.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class DeleteStudentUseCase extends BaseUseCase<
    string,
    void
> {
    constructor(private readonly repo: StudentInterface) {
        super();
    }

    protected async handle(id: string): Promise<void> {
        const student = await this.repo.findById(id);

        if (!student) {
            throw AppError.notFound("Siswa tidak ditemukan");
        }

        await this.repo.softDelete(id);
    }
}