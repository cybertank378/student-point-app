//Files: src/modules/rombel/application/usecases/DeleteRombelUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";

/**
 * ============================================================
 * DELETE ROMBEL USE CASE
 * ============================================================
 *
 * Purpose:
 * - Delete Rombel by ID.
 *
 * Business Rules:
 * - Rombel must exist.
 * - (Optional) Can prevent deletion if still has students.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
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
            throw AppError.notFound("Rombel not found");
        }

        // Optional business rule:
        // - Reject delete if rombel still has students
        // Implement here if needed

        await this.repo.delete(id);
    }
}