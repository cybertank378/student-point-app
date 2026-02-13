//Files: src/modules/academic-year/application/usecases/SetActiveAcademicYearUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class SetActiveAcademicYearUseCase {
    constructor(
        private readonly repo: AcademicYearInterface,
    ) {}

    async execute(id: string): Promise<Result<void>> {
        const existing = await this.repo.findById(id);

        if (!existing) {
            return Result.fail("Academic year not found");
        }

        // ✅ BUSINESS RULE:
        // hanya 1 academic year boleh aktif
        await this.repo.deactivateAll();
        await this.repo.setActive(id);

        return Result.ok(undefined);
    }
}
