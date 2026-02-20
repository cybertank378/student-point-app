//Files: src/modules/rombel/application/usecases/CreateRombelUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

/**
 * ============================================================
 * CREATE ROMBEL USE CASE
 * ============================================================
 *
 * Purpose:
 * - Create new Rombel entity.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - No manual Result wrapping
 * - Errors handled centrally
 */
export class CreateRombelUseCase extends BaseUseCase<
    CreateRombelDTO,
    Rombel
> {
    constructor(private readonly repo: RombelInterface) {
        super();
    }

    protected async handle(dto: CreateRombelDTO): Promise<Rombel> {
        return this.repo.create(dto);
    }
}