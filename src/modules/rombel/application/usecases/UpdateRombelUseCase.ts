//Files: src/modules/rombel/application/usecases/UpdateRombelUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

export class UpdateRombelUseCase extends BaseUseCase<
    UpdateRombelDTO,
    Rombel
> {

    constructor(private readonly repo: RombelInterface) {
        super();
    }

    protected async handle(dto: UpdateRombelDTO): Promise<Rombel> {

        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            throw new Error("Rombel tidak ditemukan.");
        }

        const rombels = await this.repo.findByAcademicYear(
            dto.academicYearId
        );

        const duplicate = rombels.find(
            (r) =>
                r.id !== dto.id &&
                r.grade === dto.grade &&
                r.name === dto.name
        );

        if (duplicate) {
            throw new Error(
                "Rombel dengan tingkat dan nama tersebut sudah ada."
            );
        }

        return this.repo.update(dto);
    }
}