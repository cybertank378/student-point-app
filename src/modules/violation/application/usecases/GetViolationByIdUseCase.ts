// Files: src/modules/violation/application/usecases/GetViolationByIdUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import type { Violation } from "@/modules/violation/domain/entity/Violation";

/**
 * ============================================================
 * GET VIOLATION BY ID USE CASE (MASTER DATA)
 * ============================================================
 *
 * Responsible for:
 * - Validating violation ID
 * - Retrieving violation master data
 * - Ensuring violation exists
 *
 * Pattern:
 *   execute(id) -> Result<Violation>
 *
 * Extends:
 *   BaseUseCase<string, Violation>
 *
 * Notes:
 * - No manual Result handling
 * - No try/catch
 * - Throw Error for business rule violation
 * - Error wrapping handled automatically by BaseUseCase
 *
 * Clean Architecture compliant.
 * ============================================================
 */
export class GetViolationByIdUseCase extends BaseUseCase<
    string,
    Violation
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
     * 2. Fetch violation
     * 3. Ensure violation exists
     *
     * Any thrown Error will be caught by BaseUseCase.execute()
     * and converted into Result.fail()
     */
    protected async handle(id: string): Promise<Violation> {

        /* =========================================================
           VALIDATION
        ========================================================= */

        if (!id) {
            throw new Error("Violation ID wajib diisi.");
        }

        /* =========================================================
           FETCH DATA
        ========================================================= */

        const violation = await this.repo.findById(id);

        if (!violation) {
            throw new Error("Violation tidak ditemukan.");
        }

        return violation;
    }
}