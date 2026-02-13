//Files: src/modules/academic-year/application/usecases/CreateAcademicYearUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class CreateAcademicYearUseCase {
    constructor(
        private readonly repo: AcademicYearInterface,
    ) {}

    async execute(
        dto: CreateAcademicYearDTO,
    ): Promise<Result<AcademicYear>> {
        const created = await this.repo.create(dto);
        return Result.ok(created);
    }
}
