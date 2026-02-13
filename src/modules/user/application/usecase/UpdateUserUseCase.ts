//Files: src/modules/user/application/usecase/UpdateUserUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import { UpdateUserDTO } from "@/modules/user/domain/dto/UpdateUserDTO";
import { User } from "@/modules/user/domain/entity/User";
import { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";

export class UpdateUserUseCase {
    constructor(
        private readonly repo: UserInterface,
        private readonly hash: HashServiceInterface,
    ) {}

    async execute(
        dto: UpdateUserDTO,
    ): Promise<Result<User>> {

        let password = dto.password;

        if (password) {
            password = await this.hash.hash(password);
        }

        const updated = await this.repo.update({
            ...dto,
            password,
        });

        return Result.ok(updated);
    }
}