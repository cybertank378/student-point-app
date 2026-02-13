//Files: src/modules/violation/application/usecases/ResetPasswordUseCase.ts

import {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";
import {AuthRepositoryInterface} from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";

export class ResetPasswordUseCase {
    constructor(
        private readonly repo: AuthRepositoryInterface,
        private readonly hash: HashServiceInterface,
    ) {}

    async execute(
        token: string,
        newPassword: string,
    ): Promise<void> {
        const hashedToken =
            await this.hash.hash(token);

        const resetToken =
            await this.repo.findValidResetToken(
                hashedToken,
            );

        if (!resetToken)
            throw new Error(
                "Invalid or expired token",
            );

        const newHash =
            await this.hash.hash(newPassword);

        await this.repo.updatePassword(
            resetToken.userId,
            newHash,
        );

        await this.repo.markResetTokenUsed(
            resetToken.id,
        );
    }
}