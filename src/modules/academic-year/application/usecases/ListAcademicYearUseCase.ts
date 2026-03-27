//Files: src/modules/academic-year/application/usecases/ListAcademicYearUseCase.ts

import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";

import type {AcademicYear} from "@/modules/academic-year/domain/entity/AcademicYear";
import type {AcademicYearInterface} from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

/**
 * ============================================================
 * LIST ACADEMIC YEAR USE CASE
 * ============================================================
 *
 * Responsibility
 * - Retrieve all academic years
 *
 * Architecture
 * - Extends BaseUseCase to standardize Result<T>
 * - No manual Result handling
 * - Errors automatically wrapped by BaseUseCase
 */

export class ListAcademicYearUseCase extends BaseUseCase<
    void,
    AcademicYear[]
> {

    constructor(
        private readonly repo: AcademicYearInterface
    ) {
        super();
    }

    /**
     * Core business logic
     */
    protected async handle(): Promise<AcademicYear[]> {

        return await this.repo.findAll();
    }
}