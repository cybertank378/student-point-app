//Files: src/modules/auth/domain/interfaces/TokenServiceInterface.ts
import type AuthPayload from "@/modules/auth/domain/entity/AuthPayload";

export interface TokenServiceInterface {
    generateAccessToken(payload: AuthPayload): Promise<string>;

    generateRefreshToken(payload: AuthPayload): Promise<string>;

    verifyRefreshToken(token: string): Promise<AuthPayload>;
}
