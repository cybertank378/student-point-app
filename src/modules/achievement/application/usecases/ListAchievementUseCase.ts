//Files: src/modules/achievement/application/usecases/ListAchievementUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Achievement } from "@/modules/achievement/domain/entity/Achievement";
import type { AchievementInterface } from "@/modules/achievement/domain/interfaces/AchievementInterface";

import type {
    BasePaginationParams,
    BasePaginationResponse,
} from "@/modules/shared/http/pagination/BasePagination";

/**
 * ============================================================
 * LIST ACHIEVEMENT USE CASE
 * ============================================================
 *
 * Responsible for:
 * - Sanitizing pagination params
 * - Enforcing pagination limit
 * - Delegating query to repository
 *
 * Pattern:
 *   execute(params) -> Result<BasePaginationResponse<Achievement>>
 *
 * Clean Architecture compliant.
 */
export class ListAchievementUseCase extends BaseUseCase<
    BasePaginationParams,
    BasePaginationResponse<Achievement>
> {

    constructor(
        private readonly repo: AchievementInterface
    ) {
        super();
    }

    protected async handle(
        params: BasePaginationParams
    ): Promise<BasePaginationResponse<Achievement>> {

        /**
         * ==============================
         * SANITIZE INPUT
         * ==============================
         */

        const page =
            params.page && params.page > 0
                ? params.page
                : 1;

        const limit =
            params.limit && params.limit > 0
                ? Math.min(params.limit, 100)
                : 10;

        /**
         * ==============================
         * DELEGATE TO REPOSITORY
         * ==============================
         */

        return await this.repo.findAll({
            ...params,
            page,
            limit,
        });
    }

}