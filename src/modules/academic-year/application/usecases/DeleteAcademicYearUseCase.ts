//Files: src/modules/academic-year/application/usecases/DeleteAcademicYearUseCase.ts
//Files: src/modules/academic-year/application/usecases/DeleteAcademicYearUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class DeleteAcademicYearUseCase extends BaseUseCase<
    string,
    void
> {

    constructor(private readonly repo: AcademicYearInterface) {
        super();
    }

    protected async handle(id: string): Promise<void> {

        const existing = await this.repo.findById(id);

        if (!existing) {
            throw new Error("Tahun ajaran tidak di temukan");
        }

        if (existing.isActive) {
            throw new Error(
                "Tahun Ajaran yang aktif tidak dapat di hapus"
            );
        }

        await this.repo.delete(id);
    }
}