// Files: src/modules/teacher/application/usecase/SearchTeacherUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type {
    TeacherSearchParams,
    TeacherSearchResult,
} from "@/modules/teacher/domain/dto/ListTeacherRespDTO";

/**
 * ============================================================
 * SEARCH TEACHER USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Validasi pagination (page & limit)
 * - Batasi limit maksimal 100
 * - Delegasi pencarian ke repository
 *
 * Error handling dilakukan oleh BaseUseCase.
 */
export class SearchTeacherUseCase
    extends BaseUseCase<TeacherSearchParams, TeacherSearchResult> {

    constructor(private readonly repo: TeacherInterface) {
        super();
    }

    /**
     * Implementasi logic pencarian guru.
     */
    protected async handle( params: TeacherSearchParams): Promise<TeacherSearchResult> {

        /**
         * ====================================================
         * VALIDASI PAGINATION
         * ====================================================
         */

        if (params.page < 1) {
            throw new Error("Halaman harus lebih dari 0.");
        }

        if (params.limit < 1 || params.limit > 100) {
            throw new Error("Limit harus antara 1 sampai 100.");
        }

        /**
         * ====================================================
         * EKSEKUSI PENCARIAN
         * ====================================================
         */

        return this.repo.search(params);
    }
}
