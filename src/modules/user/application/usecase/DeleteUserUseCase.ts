//Files: src/modules/user/application/usecase/DeleteUserUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";

/**
 * ============================================================
 * DELETE USER USE CASE
 * ============================================================
 *
 * Responsible for:
 * - Validating user ID
 * - Ensuring user exists
 * - Preventing deletion of ADMIN role
 * - Performing soft delete (isActive = false)
 *
 * Pattern:
 *   execute(userId) -> Result<void>
 *
 * Extends:
 *   BaseUseCase<string, void>
 *
 * Notes:
 * - No try/catch inside this class
 * - Business rule violations must throw Error
 * - BaseUseCase handles error conversion to Result.fail
 */
export class DeleteUserUseCase extends BaseUseCase<
    string,
    void
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
     * 2. Ensure user exists
     * 3. Prevent ADMIN deletion
     * 4. Soft delete user
     *
     * Any thrown Error will be captured by BaseUseCase.execute()
     */
    protected async handle(id: string): Promise<void> {

        /**
         * ===============================
         * VALIDATION
         * ===============================
         */
        if (!id) {
            throw new Error("User ID wajib diisi.");
        }

        const existingUser = await this.repo.findById(id);

        if (!existingUser) {
            throw new Error("User tidak ditemukan.");
        }

        /**
         * ===============================
         * BUSINESS RULE
         * ===============================
         */
        if (existingUser.role === "ADMIN") {
            throw new Error("User ADMIN tidak boleh dihapus.");
        }

        /**
         * ===============================
         * SOFT DELETE
         * ===============================
         */
        await this.repo.update(id, {
            isActive: false,
        });
    }
}