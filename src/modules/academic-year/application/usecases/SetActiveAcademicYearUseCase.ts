//Files: src/modules/academic-year/application/usecases/SetActiveAcademicYearUseCase.ts
//Files: src/modules/academic-year/application/usecases/SetActiveAcademicYearUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class SetActiveAcademicYearUseCase
    extends BaseUseCase<string, void>
{
    constructor(private readonly repo: AcademicYearInterface) {
        super();
    }

    protected async handle(id: string): Promise<void> {

        const academicYear = await this.repo.findById(id);

        if (!academicYear) {
            throw new Error("Tahun ajaran tidak ditemukan.");
        }

        await this.repo.setActive(id);
    }
}