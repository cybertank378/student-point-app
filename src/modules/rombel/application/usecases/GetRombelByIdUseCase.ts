//Files: src/modules/rombel/application/usecases/GetRombelByIdUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

/**
 * ============================================================
 * GET ROMBEL BY ID USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve Rombel entity by ID.
 *
 * Business Rules:
 * - Rombel must exist.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
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
            throw AppError.notFound("Rombel not found");
        }

        return rombel;
    }
}