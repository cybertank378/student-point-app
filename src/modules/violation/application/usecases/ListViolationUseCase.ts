// Files: src/modules/violation/application/usecases/ListViolationUseCase.ts
// Files: src/modules/violation/application/usecases/ListViolationUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import type { Violation } from "@/modules/violation/domain/entity/Violation";
import type {
    BasePaginationParams,
    BasePaginationResponse,
} from "@/modules/shared/http/pagination/BasePagination";

/**
 * ============================================================
 * LIST VIOLATION USE CASE (MASTER DATA - PAGINATED)
 * ============================================================
 *
 * Responsible for:
 * - Validating pagination parameters
 * - Delegating paginated query to repository
 * - Returning structured pagination response
 *
 * Pattern:
 *   execute(params) -> Result<BasePaginationResponse<Violation>>
 *
 * Extends:
 *   BaseUseCase<BasePaginationParams, BasePaginationResponse<Violation>>
 *
 * Notes:
 * - No manual Result handling
 * - No try/catch
 * - Error wrapping handled automatically by BaseUseCase
 * - Pagination max limit enforced
 *
 * Clean Architecture compliant.
 * ============================================================
 */
export class ListViolationUseCase extends BaseUseCase<
    BasePaginationParams,
    BasePaginationResponse<Violation>
> {
    constructor(private readonly repo: ViolationInterface) {
        super();
    }

    protected async handle(
        params: BasePaginationParams,
    ): Promise<BasePaginationResponse<Violation>> {

        /* =========================================================
           SANITIZE INPUT
        ========================================================= */

        const page = params.page && params.page > 0 ? params.page : 1;

        const limit =
            params.limit && params.limit > 0
                ? Math.min(params.limit, 100)
                : 10;

        /* =========================================================
           DELEGATE TO REPOSITORY
        ========================================================= */

        return await this.repo.findAll({
            ...params,
            page,
            limit,
        });
    }
}