//Files: src/modules/student/application/usecases/CreateStudentUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { Student } from "@/modules/student/domain/entity/Student";
import type { CreateStudentDTO } from "@/modules/student/domain/dto/CreateStudentDTO";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

/**
 * ============================================================
 * CREATE STUDENT USE CASE
 * ============================================================
 *
 * Purpose:
 * - Create new Student entity.
 *
 * Business Rules:
 * - Must have an active academic year.
 * - NIS must be unique.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class CreateStudentUseCase extends BaseUseCase<
    CreateStudentDTO,
    Student
> {
    constructor(
        private readonly studentRepo: StudentInterface,
        private readonly academicYearRepo: AcademicYearInterface
    ) {
        super();
    }

    protected async handle(
        dto: CreateStudentDTO
    ): Promise<Student> {
        // 1️⃣ Validate active academic year
        const activeYear =
            await this.academicYearRepo.findActive();

        if (!activeYear) {
            throw AppError.badRequest(
                "Tidak ada tahun ajaran aktif"
            );
        }

        // 2️⃣ Validate NIS uniqueness
        const exists =
            await this.studentRepo.findByNis(dto.nis);

        if (exists) {
            throw AppError.conflict(
                "NIS sudah terdaftar"
            );
        }

        // 3️⃣ Persist student
        return this.studentRepo.create(dto);
    }
}
