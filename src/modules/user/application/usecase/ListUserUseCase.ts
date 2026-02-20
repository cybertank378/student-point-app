// Files: src/modules/user/application/usecase/ListUserUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import type { ListUserResponseDTO } from "@/modules/user/domain/dto/ListUserResponseDTO";

/**
 * ============================================================
 * LIST USER USE CASE
 * ============================================================
 *
 * Responsible for:
 * - Sanitizing pagination input
 * - Limiting maximum page size
 * - Forwarding search parameter
 * - Returning paginated user response
 *
 * Pattern:
 *   execute(request) -> Result<ListUserResponseDTO>
 *
 * Extends:
 *   BaseUseCase<ListUserRequest, ListUserResponseDTO>
 *
 * Notes:
 * - No try/catch (handled by BaseUseCase)
 * - No Result wrapping here
 * - Pagination guard max limit = 100
 */

interface ListUserRequest {
    page?: number;
    limit?: number;
    search?: string;
}

export class ListUserUseCase extends BaseUseCase<
    ListUserRequest,
    ListUserResponseDTO
> {
    constructor(private readonly repo: UserInterface) {
        super();
    }

    /**
     * ============================================================
     * BUSINESS LOGIC
     * ============================================================
     *
     * Steps:
     * 1. Sanitize pagination input
     * 2. Normalize search keyword
     * 3. Fetch paginated data
     * 4. Return structured DTO
     *
     * Any thrown error will be handled by BaseUseCase.execute()
     */
    protected async handle(
        request: ListUserRequest
    ): Promise<ListUserResponseDTO> {

        /**
         * ===============================
         * SANITIZE INPUT
         * ===============================
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
         * ===============================
         * FETCH DATA
         * ===============================
         */
        const { data, total } = await this.repo.list({
            page,
            limit,
            search,
        });

        /**
         * ===============================
         * RETURN PAGINATED RESPONSE
         * ===============================
         */
        return {
            data,
            total,
            page,
            limit,
        };
    }
}