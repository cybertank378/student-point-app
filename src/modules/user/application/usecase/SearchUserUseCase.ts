// Files: src/modules/user/application/usecase/SearchUserUseCase.ts

import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import type {UserInterface, UserSearchParams, UserSearchResult,} from "@/modules/user/domain/interfaces/UserInterface";

/**
 * ============================================================
 * SEARCH USER USE CASE
 * ============================================================
 *
 * Responsible for:
 * - Validating search parameters
 * - Enforcing pagination boundaries
 * - Executing repository search
 *
 * Pattern:
 *   execute(params) -> Result<UserSearchResult>
 *
 * Extends:
 *   BaseUseCase<UserSearchParams, UserSearchResult>
 *
 * Notes:
 * - No try/catch (handled by BaseUseCase)
 * - Throw Error for validation failures
 * - No direct logging
 */
export class SearchUserUseCase extends BaseUseCase<
    UserSearchParams,
    UserSearchResult
> {
    constructor(private readonly userRepository: UserInterface) {
        super();
    }

    /**
     * ============================================================
     * BUSINESS LOGIC
     * ============================================================
     *
     * Steps:
     * 1. Validate pagination parameters
     * 2. Execute repository search
     *
     * Any thrown Error will be captured by BaseUseCase.execute()
     */
    protected async handle(
        params: UserSearchParams
    ): Promise<UserSearchResult> {

        /**
         * ========================================
         * BASIC VALIDATION
         * ========================================
         */
        if (params.page < 1) {
            throw new Error("Page harus lebih dari 0.");
        }

        if (params.limit < 1 || params.limit > 100) {
            throw new Error("Limit harus antara 1 - 100.");
        }

        return await this.userRepository.search(params);
    }
}