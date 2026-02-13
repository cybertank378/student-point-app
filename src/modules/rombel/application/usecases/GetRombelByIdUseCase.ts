//Files: src/modules/rombel/application/usecases/GetRombelByIdUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

export class GetRombelByIdUseCase {
    constructor(
        private readonly repo: RombelInterface,
    ) {}

    async execute(id: string): Promise<Result<Rombel>> {
        const rombel = await this.repo.findById(id);

        if (!rombel) {
            return Result.fail("Rombel not found");
        }

        return Result.ok(rombel);
    }
}
