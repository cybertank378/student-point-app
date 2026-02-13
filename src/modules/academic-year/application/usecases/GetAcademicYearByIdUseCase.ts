//Files: src/modules/academic-year/application/usecases/GetAcademicYearByIdUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class GetAcademicYearByIdUseCase {
    constructor(
        private readonly repo: AcademicYearInterface,
    ) {}

    async execute(id: string): Promise<Result<AcademicYear>> {
        const year = await this.repo.findById(id);

        if (!year) {
            return Result.fail("Academic year not found");
        }

        return Result.ok(year);
    }
}
