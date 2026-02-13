//Files: src/modules/academic-year/application/usecases/UpdateAcademicYearUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class UpdateAcademicYearUseCase {
    constructor(
        private readonly repo: AcademicYearInterface,
    ) {}

    async execute(
        dto: UpdateAcademicYearDTO,
    ): Promise<Result<AcademicYear>> {
        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            return Result.fail("Academic year not found");
        }

        const updated = await this.repo.update(dto);
        return Result.ok(updated);
    }
}
