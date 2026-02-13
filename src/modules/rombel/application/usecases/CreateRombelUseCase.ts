//Files: src/modules/rombel/application/usecases/CreateRombelUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

export class CreateRombelUseCase {
    constructor(
        private readonly repo: RombelInterface,
    ) {}

    async execute(
        dto: CreateRombelDTO,
    ): Promise<Result<Rombel>> {
        const created = await this.repo.create(dto);
        return Result.ok(created);
    }
}
