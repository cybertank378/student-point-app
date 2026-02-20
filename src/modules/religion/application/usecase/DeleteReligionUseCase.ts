//Files: src/modules/religion/application/usecase/DeleteReligionUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";

/**
 * ============================================================
 * DELETE RELIGION USE CASE
 * ============================================================
 *
 * Purpose:
 * - Delete Religion by ID.
 *
 * Business Rules:
 * - Religion must exist before deletion.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class DeleteReligionUseCase extends BaseUseCase<string, void> {
    constructor(private readonly repo: ReligionInterface) {
        super();
    }

    protected async handle(id: string): Promise<void> {
        const existing = await this.repo.findById(id);

        if (!existing) {
            throw AppError.notFound("ID Agama tidak ditemukan");
        }

        await this.repo.delete(id);
    }
}
