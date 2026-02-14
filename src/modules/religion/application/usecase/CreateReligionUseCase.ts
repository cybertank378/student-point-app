//Files: src/modules/religion/application/usecase/CreateReligionUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Religion } from "@/modules/religion/domain/entity/Religion";
import type { CreateReligionDTO } from "@/modules/religion/domain/dto/CreateReligionDTO";
import type {ReligionInterface} from "@/modules/religion/domain/interfaces/ReligionInterface";

export class CreateReligionUseCase {
    constructor(
        private readonly repo: ReligionInterface,
    ) {}

    async execute(
        dto: CreateReligionDTO,
    ): Promise<Result<Religion>> {

        const exists = await this.repo.findByCode(dto.kode);
        if (exists) {
            return Result.fail("Kode agama sudah terdaftar");
        }

        const religion = await this.repo.create(dto);
        return Result.ok(religion);
    }
}
