//Files: src/modules/user/application/usecase/ListUserAuthUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import {User} from "@/modules/user/domain/entity/User";

export class ListUserUseCase {
    constructor(private readonly repo: UserInterface) {}

    async execute(): Promise<Result<User[]>> {
        const users = await this.repo.findAll();
        return Result.ok(users);
    }
}