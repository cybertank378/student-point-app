//Files: src/modules/teacher/application/usecase/ListTeacherUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { ListTeacherParams } from "@/modules/teacher/domain/dto/ListTeacherRespDTO";

/**
 * ============================================================
 * LIST TEACHER USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Normalisasi pagination
 * - Batasi maksimum limit (anti abuse)
 * - Trim search keyword
 *
 * Error handling dilakukan oleh BaseUseCase.
 */
export class ListTeacherUseCase
    extends BaseUseCase<
        ListTeacherParams,
        {
            data: readonly Teacher[];
            total: number;
            page: number;
            limit: number;
        }
    > {

    constructor(private readonly repo: TeacherInterface) {
        super();
    }

    /**
     * Implementasi logic pengambilan daftar guru.
     */
    protected async handle(
        request: ListTeacherParams
    ): Promise<{
        data: readonly Teacher[];
        total: number;
        page: number;
        limit: number;
    }> {

        /**
         * ====================================================
         * NORMALISASI PAGINATION
         * ====================================================
         */

        const page =
            request.page && request.page > 0
                ? request.page
                : 1;

        const limit =
            request.limit && request.limit > 0
                ? Math.min(request.limit, 100)
                : 10;

        const search = request.search?.trim();

        /**
         * ====================================================
         * QUERY REPOSITORY
         * ====================================================
         */

        const { data, total } = await this.repo.findAll({
            page,
            limit,
            search,
        });

        return {
            data,
            total,
            page,
            limit,
        };
    }
}
