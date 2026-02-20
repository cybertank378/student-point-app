// Files: src/modules/violation/application/usecases/DeleteViolationUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";

/**
 * ============================================================
 * DELETE VIOLATION USE CASE (MASTER DATA)
 * ============================================================
 *
 * Responsible for:
 * - Validating violation ID
 * - Preventing deletion if violation already used
 * - Performing soft delete
 *
 * Pattern:
 *   execute(id) -> Result<void>
 *
 * Extends:
 *   BaseUseCase<string, void>
 *
 * Notes:
 * - No manual Result handling
 * - No try/catch
 * - Throw Error for business rule violation
 * - Error wrapping handled by BaseUseCase
 *
 * Clean Architecture compliant.
 * ============================================================
 */
export class DeleteViolationUseCase extends BaseUseCase<
    string,
    void
> {
    constructor(
        private readonly repo: ViolationInterface
    ) {
        super();
    }

    /**
     * ============================================================
     * BUSINESS LOGIC
     * ============================================================
     *
     * Steps:
     * 1. Validate ID
     * 2. Check if violation already used
     * 3. Perform soft delete
     *
     * Any thrown Error will be caught by BaseUseCase.execute()
     * and converted into Result.fail()
     */
    protected async handle(id: string): Promise<void> {

        /* =========================================================
           VALIDATION
        ========================================================= */

        if (!id) {
            throw new Error("Violation ID wajib diisi.");
        }

        /* =========================================================
           BUSINESS RULE
           Cannot delete if violation already used
        ========================================================= */

        const isUsed = await this.repo.isUsed(id);

        if (isUsed) {
            throw new Error(
                "Violation sudah digunakan dan tidak dapat dihapus."
            );
        }

        /* =========================================================
           SOFT DELETE
        ========================================================= */

        await this.repo.softDelete(id);
    }
}