//Files: src/modules/user/application/usecase/DeleteUserUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";

export class DeleteUserUseCase {
    constructor(private readonly repo: UserInterface) {}

    async execute(id: string): Promise<Result<void>> {
        try {
            /**
             * ===============================
             * VALIDATION
             * ===============================
             */
            if (!id) {
                return Result.fail("User ID wajib diisi.");
            }

            const existingUser = await this.repo.findById(id);

            if (!existingUser) {
                return Result.fail("User tidak ditemukan.");
            }

            /**
             * ===============================
             * BUSINESS RULE
             * ===============================
             */
            if (existingUser.role === "ADMIN") {
                return Result.fail("User ADMIN tidak boleh dihapus.");
            }

            /**
             * ===============================
             * SOFT DELETE
             * ===============================
             */
            await this.repo.update(id, {
                isActive: false,
            });

            return Result.ok(undefined);
        } catch (error) {
            return Result.fail("Gagal menghapus user.");
        }
    }
}

