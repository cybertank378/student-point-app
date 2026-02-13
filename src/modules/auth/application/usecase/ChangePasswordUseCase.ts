//Files: src/modules/auth/application/usecase/ChangePasswordUseCase.ts

import {AuthRepositoryInterface} from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";

export class ChangePasswordUseCase {
    constructor(
        private readonly repo: AuthRepositoryInterface,
        private readonly hash: HashServiceInterface,
    ) {}

    async execute(
        userId: string,
        oldPassword: string,
        newPassword: string,
    ): Promise<void> {
        const user =
            await this.repo.findById(userId);

        if (!user)
            throw new Error("User not found");

        const valid =
            await this.hash.compare(
                oldPassword,
                user.password,
            );

        if (!valid)
            throw new Error("Invalid old password");

        const newHash =
            await this.hash.hash(newPassword);

        await this.repo.updatePassword(
            userId,
            newHash,
        );
    }
}