//Files: src/modules/user/application/usecase/GetUserByIdUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import { UserEntity } from "@/modules/user/domain/entity/UserEntity";


export class GetUserByIdUseCase {
    constructor(private readonly repo: UserInterface) {}

    async execute(id: string): Promise<Result<UserEntity>> {
        try {
            /**
             * ===============================
             * VALIDATION
             * ===============================
             */
            if (!id) {
                return Result.fail("User ID wajib diisi.");
            }

            /**
             * ===============================
             * FETCH USER
             * ===============================
             */
            const user = await this.repo.findById(id);

            if (!user) {
                return Result.fail("User tidak ditemukan.");
            }

            /**
             * ===============================
             * BUSINESS RULE
             * ===============================
             */
            if (!user.isActive) {
                return Result.fail("User sudah tidak aktif.");
            }

            return Result.ok(user);
        } catch (error) {
            return Result.fail("Terjadi kesalahan saat mengambil user.");
        }
    }
}
