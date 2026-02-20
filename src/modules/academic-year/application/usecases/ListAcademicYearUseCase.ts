//Files: src/modules/academic-year/application/usecases/ListAcademicYearUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";

/**
 * ============================================================
 * LIST ACADEMIC YEAR USE CASE
 * ============================================================
 *
 * Responsibility:
 * - Retrieve all academic years from repository.
 *
 * Architecture Notes:
 * - Extends BaseUseCase to ensure standardized Result<Response>.
 * - Does NOT return Result manually.
 * - Throws error if something unexpected happens.
 *
 * Flow:
 *   Controller -> execute()
 *               -> BaseUseCase.execute()
 *               -> handle()
 *               -> return AcademicYear[]
 *               -> wrapped into Result.ok()
 *
 * Error Handling:
 * - Any thrown error inside handle() will automatically
 *   be converted into Result.fail() by BaseUseCase.
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
     * Core business logic.
     *
     * This method should:
     * - Contain only application logic
     * - Return raw domain entity
     * - Throw error if needed
     *
     * No Result wrapping here.
     */
    protected async handle(): Promise<AcademicYear[]> {
        const rows = await this.repo.findAll();

        // Optional business rule:
        // Uncomment if empty data should be treated as error.
        //
        // if (!rows.length) {
        //     throw new Error("Data tahun ajaran tidak ditemukan.");
        // }

        return rows;
    }
}