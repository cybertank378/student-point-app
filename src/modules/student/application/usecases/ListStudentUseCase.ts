//Files: src/modules/student/application/usecases/ListStudentUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Student } from "@/modules/student/domain/entity/Student";
import type { StudentQueryDTO } from "@/modules/student/domain/dto/StudentQueryDTO";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * LIST STUDENT USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve students with optional query filter.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - No manual Result wrapping
 * - Errors handled centrally
 */
export class ListStudentUseCase extends BaseUseCase<
    StudentQueryDTO | undefined,
    Student[]
> {
    constructor(private readonly repo: StudentInterface) {
        super();
    }

    protected async handle(
        query?: StudentQueryDTO
    ): Promise<Student[]> {
        return this.repo.findAll(query);
    }
}