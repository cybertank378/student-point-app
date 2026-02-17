//Files: src/modules/user/application/usecase/SearchUserUseCase.ts

import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import type {
    UserSearchParams,
    UserSearchResult,
} from "@/modules/user/domain/interfaces/UserInterface";

import { Result } from "@/modules/shared/core/Result";

export class SearchUserUseCase {
    constructor(private readonly userRepository: UserInterface) {}

    async execute(
        params: UserSearchParams
    ): Promise<Result<UserSearchResult>> {
        try {
            /**
             * ========================================
             * BASIC VALIDATION
             * ========================================
             */
            if (params.page < 1) {
                return Result.fail("Page harus lebih dari 0.");
            }

            if (params.limit < 1 || params.limit > 100) {
                return Result.fail("Limit harus antara 1 - 100.");
            }

            /**
             * ========================================
             * EXECUTE SEARCH
             * ========================================
             */
            const result = await this.userRepository.search(params);

            return Result.ok(result);
        } catch (error) {
            console.error("SearchUserUseCase Error:", error);
            return Result.fail("Terjadi kesalahan saat mencari user.");
        }
    }
}
