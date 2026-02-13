//Files: src/modules/rombel/application/usecases/UpdateRombelUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

export class UpdateRombelUseCase {
    constructor(
        private readonly repo: RombelInterface,
    ) {}

    async execute(
        dto: UpdateRombelDTO,
    ): Promise<Result<Rombel>> {
        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            return Result.fail("Rombel not found");
        }

        const updated = await this.repo.update(dto);
        return Result.ok(updated);
    }
}
