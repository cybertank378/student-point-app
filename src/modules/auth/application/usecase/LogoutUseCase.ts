//Files: src/modules/auth/application/usecase/LogoutUseCase.ts


import { AuthRepositoryInterface } from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import crypto from "crypto";

export class LogoutUseCase {
    constructor(
        private readonly repo: AuthRepositoryInterface,
    ) {}

    // Logout by refresh token
    async executeByRefreshToken(refreshToken: string): Promise<void> {
        const tokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const session = await this.repo.findSessionByTokenHash(tokenHash);

        if (!session) return;

        await this.repo.revokeSession(session.id);
    }

    // Optional: logout all devices
    async execute(userId: string): Promise<void> {
        const sessions =
            await this.repo.findValidSession(userId);

        for (const session of sessions) {
            await this.repo.revokeSession(session.id);
        }
    }
}
