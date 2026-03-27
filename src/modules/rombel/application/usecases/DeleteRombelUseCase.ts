//Files: src/modules/rombel/application/usecases/DeleteRombelUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

export class DeleteRombelUseCase extends BaseUseCase<
    string,
    void
> {

    constructor(private readonly repo: RombelInterface) {
        super();
    }

    protected async handle(id: string): Promise<void> {

        const existing = await this.repo.findById(id);

        if (!existing) {
            throw new Error("Rombel tidak ditemukan.");
        }

        if (existing.studentCount > 0) {
            throw new Error(
                "Rombel tidak dapat dihapus karena masih memiliki siswa."
            );
        }

        await this.repo.delete(id);
    }
}