//Files: src/modules/rombel/application/usecases/UpdateRombelUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

/**
 * ============================================================
 * UPDATE ROMBEL USE CASE
 * ============================================================
 *
 * Purpose:
 * - Update existing Rombel entity.
 *
 * Business Rules:
 * - Rombel must exist before update.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
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
            throw AppError.notFound("Rombel not found");
        }

        return this.repo.update(dto);
    }
}