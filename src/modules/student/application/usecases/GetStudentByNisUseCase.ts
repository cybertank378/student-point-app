//Files: src/modules/student/application/usecases/GetStudentByNisUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { Student } from "@/modules/student/domain/entity/Student";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * GET STUDENT BY NIS USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve student by NIS.
 *
 * Business Rules:
 * - Students must exist.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class GetStudentByNisUseCase extends BaseUseCase<
    number,
    Student
> {
    constructor(private readonly repo: StudentInterface) {
        super();
    }

    protected async handle(nis: number): Promise<Student> {
        const student = await this.repo.findByNis(nis);

        if (!student) {
            throw AppError.notFound(
                `Siswa dengan ${nis} tidak ditemukan`
            );
        }

        return student;
    }
}