//Files: src/modules/academic-year/application/usecases/SetActiveAcademicYearUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";
import { serverLog } from "@/libs/serverLogger";

/**
 * ============================================================
 * SET ACTIVE ACADEMIC YEAR USE CASE
 * ============================================================
 *
 * Responsibility:
 * - Validate academic year existence
 * - Activate selected academic year
 *
 * Business Rules:
 * - Academic year must exist
 * - Only existing academic year can be activated
 *
 * This use case relies on:
 * - BaseUseCase for standardized Result handling
 * - Repository abstraction (AcademicYearInterface)
 *
 * Result:
 * - Success → void
 * - Failure → meaningful error message
 */
export class SetActiveAcademicYearUseCase
    extends BaseUseCase<string, void>
{
    constructor(
        private readonly repo: AcademicYearInterface
    ) {
        super();
    }

    /**
     * ============================================================
     * BUSINESS LOGIC
     * ============================================================
     *
     * @param id - Academic year ID
     */
    protected async handle(id: string): Promise<void> {
        serverLog("SET_ACTIVE_ACADEMIC_YEAR_REQUEST", { id });

        const academicYear = await this.repo.findById(id);

        if (!academicYear) {
            serverLog("ACADEMIC_YEAR_NOT_FOUND", { id });
            throw new Error("Tahun ajaran tidak ditemukan.");
        }

        await this.repo.setActive(id);

        serverLog("ACADEMIC_YEAR_ACTIVATED", { id });
    }
}