//Files: src/modules/academic-year/application/usecases/GetAcademicYearByIdUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

/**
 * ============================================================
 * GET ACADEMIC YEAR BY ID USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve a single AcademicYear entity by its ID.
 *
 * Business Rules:
 * - Academic year must exist.
 *
 * Architecture:
 * - Extends BaseUseCase to standardize Result<Response>.
 * - Does NOT manually return Result.
 * - Throws error for failure cases.
 * - BaseUseCase handles error conversion automatically.
 *
 * Flow:
 *   Controller
 *        ↓
 *   execute(id)   (BaseUseCase)
 *        ↓
 *   handle(id)
 *        ↓
 *   return AcademicYear
 *        ↓
 *   wrapped into Result.ok()
 *
 * Error Handling:
 * - If entity not found → throw Error
 * - BaseUseCase converts it into Result.fail()
 */
export class GetAcademicYearByIdUseCase extends BaseUseCase<
    string,
    AcademicYear
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
     * - Fetch academic year by ID
     * - Validate existence
     *
     * Notes:
     * - Throw Error instead of returning Result.fail()
     * - No try/catch needed (handled by BaseUseCase)
     */
    protected async handle(id: string): Promise<AcademicYear> {
        const year = await this.repo.findById(id);

        if (!year) {
            throw new Error("Academic year not found");
        }

        return year;
    }
}