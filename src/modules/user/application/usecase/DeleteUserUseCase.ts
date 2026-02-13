//Files: src/modules/user/application/usecase/DeleteUserUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";

export class DeleteUserUseCase {
    constructor(private readonly repo: UserInterface) {}

    async execute(id: string): Promise<Result<void>> {
        await this.repo.delete(id);
        return Result.ok();
    }
}
