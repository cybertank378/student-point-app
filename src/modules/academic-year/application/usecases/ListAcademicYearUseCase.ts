//Files: src/modules/academic-year/application/usecases/ListAcademicYearUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class ListAcademicYearUseCase {
    constructor(
        private readonly repo: AcademicYearInterface,
    ) {}

    async execute(): Promise<Result<AcademicYear[]>> {
        const rows = await this.repo.findAll();
        return Result.ok(rows);
    }
}
