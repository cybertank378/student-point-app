//Files: src/modules/rombel/application/usecases/DeleteRombelUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

export class DeleteRombelUseCase {
    constructor(
        private readonly repo: RombelInterface,
    ) {}

    async execute(id: string): Promise<Result<void>> {
        const existing = await this.repo.findById(id);

        if (!existing) {
            return Result.fail("Rombel not found");
        }

        // ⚠️ OPTIONAL BUSINESS RULE:
        // - Tolak delete jika masih ada siswa
        // (bisa ditambahkan nanti)

        await this.repo.delete(id);
        return Result.ok(undefined);
    }
}
