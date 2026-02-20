//Files: src/modules/academic-year/application/usecases/UpdateAcademicYearUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

/**
 * ============================================================
 * UPDATE ACADEMIC YEAR USE CASE
 * ============================================================
 *
 * Purpose:
 * - Update an existing AcademicYear entity.
 *
 * Business Rules:
 * - Academic year must exist before updating.
 *
 * Architecture:
 * - Extends BaseUseCase to standardize Result<Response>.
 * - Does NOT manually return Result.
 * - Throws error for failure cases.
 * - BaseUseCase handles error wrapping automatically.
 *
 * Execution Flow:
 *   Controller
 *        ↓
 *   execute(dto)     (BaseUseCase)
 *        ↓
 *   handle(dto)
 *        ↓
 *   return AcademicYear
 *        ↓
 *   BaseUseCase wraps into Result.ok()
 *
 * Error Handling:
 * - If entity not found → throw Error
 * - Any unexpected error → handled by BaseUseCase
 */
export class UpdateAcademicYearUseCase extends BaseUseCase<
    UpdateAcademicYearDTO,
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
     * - Validate entity existence
     * - Perform update operation
     *
     * Notes:
     * - Throw Error instead of returning Result.fail()
     * - No manual Result wrapping here
     */
    protected async handle(
        dto: UpdateAcademicYearDTO
    ): Promise<AcademicYear> {
        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            throw new Error("Academic year not found");
        }

        const updated = await this.repo.update(dto);

        return updated;
    }
}