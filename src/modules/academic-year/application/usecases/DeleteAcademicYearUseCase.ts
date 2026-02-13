//Files: src/modules/academic-year/application/usecases/DeleteAcademicYearUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class DeleteAcademicYearUseCase {
    constructor(
        private readonly repo: AcademicYearInterface,
    ) {}

    async execute(id: string): Promise<Result<void>> {
        const existing = await this.repo.findById(id);

        if (!existing) {
            return Result.fail("Academic year not found");
        }

        if (existing.isActive) {
            return Result.fail(
                "Active academic year cannot be deleted",
            );
        }

        await this.repo.delete(id);
        return Result.ok(undefined);
    }
}
