//Files: src/modules/rombel/application/usecases/CreateRombelUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

export class CreateRombelUseCase extends BaseUseCase<
    CreateRombelDTO,
    Rombel
> {

    constructor(
        private readonly repo: RombelInterface
    ) {
        super();
    }

    protected async handle(dto: CreateRombelDTO): Promise<Rombel> {

        const rombels = await this.repo.findByAcademicYear(
            dto.academicYearId
        );

        const exists = rombels.find(
            (r) => r.grade === dto.grade && r.name === dto.name
        );

        if (exists) {
            throw new Error(
                "Rombel sudah ada pada tahun ajaran tersebut."
            );
        }

        return this.repo.create(dto);

    }

}