//Files: src/modules/rombel/application/usecases/ListRombelUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

export class ListRombelUseCase {
    constructor(
        private readonly repo: RombelInterface,
    ) {}

    async execute(): Promise<Result<Rombel[]>> {
        const rows = await this.repo.findAll();
        return Result.ok(rows);
    }
}
