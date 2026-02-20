// Files: src/modules/user/application/usecase/GetUserByIdUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";

/**
 * ============================================================
 * GET USER BY ID USE CASE
 * ============================================================
 *
 * Responsible for:
 * - Validating user ID
 * - Fetching user from repository
 * - Ensuring user exists
 * - Ensuring user is active
 *
 * Pattern:
 *   execute(userId) -> Result<UserEntity>
 *
 * Extends:
 *   BaseUseCase<string, UserEntity>
 *
 * Notes:
 * - No try/catch here (handled by BaseUseCase)
 * - Business rule violations must throw Error
 * - BaseUseCase converts thrown Error into Result.fail()
 */
export class GetUserByIdUseCase extends BaseUseCase<
    string,
    UserEntity
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
     * 1. Validate ID
     * 2. Fetch user
     * 3. Ensure user exists
     * 4. Ensure user is active
     *
     * Any thrown Error will be caught by BaseUseCase.execute()
     */
    protected async handle(id: string): Promise<UserEntity> {

        /**
         * ===============================
         * VALIDATION
         * ===============================
         */
        if (!id) {
            throw new Error("User ID wajib diisi.");
        }

        /**
         * ===============================
         * FETCH USER
         * ===============================
         */
        const user = await this.repo.findById(id);

        if (!user) {
            throw new Error("User tidak ditemukan.");
        }

        /**
         * ===============================
         * BUSINESS RULE
         * ===============================
         */
        if (!user.isActive) {
            throw new Error("User sudah tidak aktif.");
        }

        return user;
    }
}