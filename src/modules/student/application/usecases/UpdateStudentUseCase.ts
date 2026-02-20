//Files: src/modules/student/application/usecases/UpdateStudentUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { Student } from "@/modules/student/domain/entity/Student";
import type { UpdateStudentDTO } from "@/modules/student/domain/dto/UpdateStudentDTO";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * UPDATE STUDENT USE CASE
 * ============================================================
 *
 * Purpose:
 * - Update existing student.
 *
 * Business Rules:
 * - Student must exist before update.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class UpdateStudentUseCase extends BaseUseCase<
    UpdateStudentDTO,
    Student
> {
    constructor(private readonly repo: StudentInterface) {
        super();
    }

    protected async handle(
        dto: UpdateStudentDTO
    ): Promise<Student> {
        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            throw AppError.notFound("Siswa tidak ditemukan");
        }

        return this.repo.update(dto);
    }
}