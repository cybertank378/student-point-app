//Files: src/modules/academic-year/application/usecases/CreateAcademicYearUseCase.ts
//Files: src/modules/academic-year/application/usecases/CreateAcademicYearUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

export class CreateAcademicYearUseCase extends BaseUseCase<
    CreateAcademicYearDTO,
    AcademicYear
> {
    constructor(private readonly repo: AcademicYearInterface) {
        super();
    }

    protected async handle(dto: CreateAcademicYearDTO): Promise<AcademicYear> {

        const overlap = await this.repo.findOverlapping(
            dto.startDate,
            dto.endDate
        );

        if (overlap) {
            throw new Error(
                "Rentang tahun ajaran bertabrakan dengan data yang sudah ada."
            );
        }

        return this.repo.create(dto);
    }
}