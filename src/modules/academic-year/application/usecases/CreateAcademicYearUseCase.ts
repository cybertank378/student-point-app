//Files: src/modules/academic-year/application/usecases/CreateAcademicYearUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

/**
 * ============================================================
 * CREATE ACADEMIC YEAR USE CASE
 * ============================================================
 *
 * Purpose:
 * - Handle creation of new AcademicYear entity.
 *
 * Architecture:
 * - Extends BaseUseCase to standardize Result<Response>.
 * - Does NOT manually return Result.
 * - Error handling is centralized in BaseUseCase.
 *
 * Execution Flow:
 *   Controller
 *        ↓
 *   execute(dto)  (from BaseUseCase)
 *        ↓
 *   handle(dto)   (business logic here)
 *        ↓
 *   return AcademicYear
 *        ↓
 *   BaseUseCase wraps into Result.ok()
 *
 * Error Handling:
 * - If repository throws error → BaseUseCase converts to Result.fail()
 * - No try/catch needed here.
 */
export class CreateAcademicYearUseCase extends BaseUseCase<
    CreateAcademicYearDTO,
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
     * - Call repository to persist new AcademicYear
     * - Return created entity
     *
     * Notes:
     * - Do NOT wrap with Result here.
     * - Throw error if business validation is required.
     */
    protected async handle(
        dto: CreateAcademicYearDTO
    ): Promise<AcademicYear> {
        const created = await this.repo.create(dto);
        return created;
    }
}