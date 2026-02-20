// Files: src/modules/violation/application/usecases/UpdateViolationUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { UpdateViolationDTO } from "@/modules/violation/domain/dto/UpdateViolationDTO";
import type { Violation } from "@/modules/violation/domain/entity/Violation";
import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import { resolveViolationLevel } from "@/modules/violation/domain/rules/ViolationLevelRule";

/**
 * ============================================================
 * UPDATE VIOLATION USE CASE (MASTER DATA)
 * ============================================================
 *
 * Responsible for:
 * - Validating violation existence
 * - Validating input data
 * - Recalculating violation level based on point
 * - Persisting updated violation
 *
 * Pattern:
 *   execute(dto) -> Result<Violation>
 *
 * Extends:
 *   BaseUseCase<UpdateViolationDTO, Violation>
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
export class UpdateViolationUseCase extends BaseUseCase<
    UpdateViolationDTO,
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
     * 2. Ensure violation exists
     * 3. Validate input
     * 4. Resolve level from point
     * 5. Persist update
     *
     * Any thrown Error will be caught by BaseUseCase.execute()
     */
    protected async handle(
        dto: UpdateViolationDTO
    ): Promise<Violation> {

        /* =========================================================
           VALIDATION
        ========================================================= */

        if (!dto.id) {
            throw new Error("Violation ID wajib diisi.");
        }

        if (!dto.name || dto.name.trim() === "") {
            throw new Error("Nama pelanggaran wajib diisi.");
        }

        if (dto.point <= 0) {
            throw new Error("Point pelanggaran harus lebih dari 0.");
        }

        /* =========================================================
           ENSURE EXISTS
        ========================================================= */

        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            throw new Error("Violation tidak ditemukan.");
        }

        /* =========================================================
           DOMAIN RULE
        ========================================================= */

        const level = resolveViolationLevel(dto.point);

        /* =========================================================
           PERSIST UPDATE
        ========================================================= */

        return await this.repo.update({
            ...dto,
            level,
        });
    }
}