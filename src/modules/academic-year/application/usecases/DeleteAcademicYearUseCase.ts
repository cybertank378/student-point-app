//Files: src/modules/academic-year/application/usecases/DeleteAcademicYearUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

/**
 * ============================================================
 * DELETE ACADEMIC YEAR USE CASE
 * ============================================================
 *
 * Purpose:
 * - Delete an AcademicYear entity by ID.
 *
 * Business Rules:
 * - Academic year must exist.
 * - Active academic year cannot be deleted.
 *
 * Architecture:
 * - Extends BaseUseCase to standardize Result handling.
 * - Does NOT manually return Result.
 * - Throws error for failure cases.
 * - Error wrapping is handled centrally by BaseUseCase.
 *
 * Flow:
 *   Controller
 *        ↓
 *   execute(id)  (BaseUseCase)
 *        ↓
 *   handle(id)
 *        ↓
 *   return void
 *        ↓
 *   BaseUseCase wraps into Result.ok()
 *
 * Error Handling:
 * - Any thrown Error will automatically
 *   become Result.fail() via BaseUseCase.
 */
export class DeleteAcademicYearUseCase extends BaseUseCase<
    string,
    void
> {
    constructor(
        private readonly repo: AcademicYearInterface
    ) {
        super();
    }

    /**
     * Core business logic.
     *
     * Responsibilities:
     * - Validate entity existence
     * - Enforce domain rules
     * - Perform deletion
     *
     * Notes:
     * - Throw Error instead of returning Result.fail()
     * - BaseUseCase handles error conversion
     */
    protected async handle(id: string): Promise<void> {
        const existing = await this.repo.findById(id);

        if (!existing) {
            throw new Error("Academic year not found");
        }

        if (existing.isActive) {
            throw new Error(
                "Active academic year cannot be deleted"
            );
        }

        await this.repo.delete(id);
    }
}