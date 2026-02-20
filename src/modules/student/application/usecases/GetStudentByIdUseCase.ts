//Files: src/modules/student/application/usecases/GetStudentByIdUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { Student } from "@/modules/student/domain/entity/Student";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * GET STUDENT BY ID USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve student by ID.
 *
 * Business Rules:
 * - Student must exist.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class GetStudentByIdUseCase extends BaseUseCase<
    string,
    Student
> {
    constructor(private readonly repo: StudentInterface) {
        super();
    }

    protected async handle(id: string): Promise<Student> {
        const student = await this.repo.findById(id);

        if (!student) {
            throw AppError.notFound("Student tidak ditemukan");
        }

        return student;
    }
}