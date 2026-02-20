//Files: src/modules/religion/application/usecase/GetReligionByIdUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { Religion } from "@/modules/religion/domain/entity/Religion";
import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";

/**
 * ============================================================
 * GET RELIGION BY ID USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve a Religion entity by ID.
 *
 * Business Rules:
 * - Religion must exist.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class GetReligionByIdUseCase extends BaseUseCase<
    string,
    Religion
> {
    constructor(private readonly repo: ReligionInterface) {
        super();
    }

    protected async handle(id: string): Promise<Religion> {
        const religion = await this.repo.findById(id);

        if (!religion) {
            throw AppError.notFound("ID Agama tidak ditemukan");
        }

        return religion;
    }
}