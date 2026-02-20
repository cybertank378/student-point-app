// Files: src/modules/violation/application/usecases/CreateViolationUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import type { CreateViolationDTO } from "@/modules/violation/domain/dto/CreateViolationDTO";
import type { Violation } from "@/modules/violation/domain/entity/Violation";
import { resolveViolationLevel } from "@/modules/violation/domain/rules/ViolationLevelRule";

/**
 * ============================================================
 * CREATE VIOLATION USE CASE (MASTER DATA)
 * ============================================================
 *
 * Responsible for:
 * - Validating violation master data
 * - Resolving violation level based on point
 * - Persisting violation template
 *
 * This use case does NOT:
 * - Assign violation to student
 * - Handle violation record history
 *
 * Pattern:
 *   execute(dto) -> Result<Violation>
 *
 * Extends:
 *   BaseUseCase<CreateViolationDTO, Violation>
 *
 * Clean Architecture compliant.
 * ============================================================
 */
export class CreateViolationUseCase extends BaseUseCase<
    CreateViolationDTO,
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
     * 1. Validate violation master data
     * 2. Resolve violation level from point
     * 3. Persist violation template
     */
    protected async handle(
        dto: CreateViolationDTO
    ): Promise<Violation> {

        /* =========================================================
           VALIDATION
        ========================================================= */

        if (!dto.name || dto.name.trim() === "") {
            throw new Error("Nama pelanggaran wajib diisi.");
        }

        if (dto.point <= 0) {
            throw new Error("Point pelanggaran harus lebih dari 0.");
        }

        /* =========================================================
           DOMAIN RULE
        ========================================================= */

        const level = resolveViolationLevel(dto.point);

        /* =========================================================
           PERSIST MASTER DATA
        ========================================================= */

        return await this.repo.create({
            ...dto,
            level,
        });
    }
}