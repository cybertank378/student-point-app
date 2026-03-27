//Files: src/modules/rombel/application/usecases/GetRombelByIdUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

export class GetRombelByIdUseCase extends BaseUseCase<
    string,
    Rombel
> {

    constructor(private readonly repo: RombelInterface) {
        super();
    }

    protected async handle(id: string): Promise<Rombel> {

        const rombel = await this.repo.findById(id);

        if (!rombel) {
            throw new Error("Rombel tidak ditemukan.");
        }

        return rombel;
    }
}