//Files: src/modules/academic-year/application/usecases/UpdateAcademicYearUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class UpdateAcademicYearUseCase extends BaseUseCase<
    UpdateAcademicYearDTO,
    AcademicYear
> {

    constructor(private readonly repo: AcademicYearInterface) {
        super();
    }

    protected async handle(dto: UpdateAcademicYearDTO): Promise<AcademicYear> {

        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            throw new Error("Tahun Ajaran tidak ditemukan");
        }

        const overlap = await this.repo.findOverlapping(
            dto.startDate,
            dto.endDate
        );

        if (overlap && existing.name !== dto.name) {
            throw new Error(
                "Rentang tahun ajaran bertabrakan dengan data yang sudah ada."
            );
        }

        return this.repo.update(dto);
    }
}