//Files: src/modules/user/application/usecase/GetUserByIdUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import { User } from "@/modules/user/domain/entity/User";
import { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";

export class GetUserByIdUseCase {
    constructor(private readonly repo: UserInterface) {}

    async execute(
        id: string,
    ): Promise<Result<User>> {
        const user = await this.repo.findById(id);

        if (!user) {
            return Result.fail("Pengguna tidak ditemukan");
        }

        return Result.ok(user);
    }
}