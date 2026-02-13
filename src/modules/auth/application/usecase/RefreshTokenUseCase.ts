//Files: src/modules/auth/application/usecase/RefreshTokenUseCase.ts

import {AuthRepositoryInterface} from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";
import {TokenServiceInterface} from "@/modules/auth/domain/interfaces/TokenServiceInterface";
import {SEVEN_DAYS} from "@/libs/utils";

export class RefreshTokenUseCase {
    constructor(
        private readonly repo: AuthRepositoryInterface,
        private readonly hash: HashServiceInterface,
        private readonly token: TokenServiceInterface,
    ) {}

    async execute(
        refreshToken: string,
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const payload =
            await this.token.verifyRefreshToken(refreshToken);

        const sessions =
            await this.repo.findValidSession(payload.sub);

        let validSessionId: string | null = null;

        for (const session of sessions) {
            const match = await this.hash.compare(
                refreshToken,
                session.tokenHash,
            );
            if (match) {
                validSessionId = session.id;
                break;
            }
        }

        if (!validSessionId)
            throw new Error("Invalid session");

        await this.repo.revokeSession(validSessionId);

        const newPayload = {
            sub: payload.sub,
            role: payload.role,
        };

        const newAccess =
            await this.token.generateAccessToken(newPayload);

        const newRefresh =
            await this.token.generateRefreshToken(newPayload);

        const newHash =
            await this.hash.hash(newRefresh);

        await this.repo.saveSession(
            payload.sub,
            newHash,
            new Date(Date.now() + SEVEN_DAYS),
        );

        return {
            accessToken: newAccess,
            refreshToken: newRefresh,
        };
    }
}
