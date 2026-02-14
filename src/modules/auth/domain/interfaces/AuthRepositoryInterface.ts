//Files: src/modules/auth/domain/interfaces/AuthRepositoryInterface.ts

import type {AuthUser} from "@/modules/auth/domain/entity/AuthUser";
import type {AuthSession} from "@/modules/auth/domain/entity/AuthSession";
import type {PasswordResetToken} from "@/modules/auth/domain/entity/PasswordResetToken";

export interface AuthRepositoryInterface {
    findByUsername(username: string): Promise<AuthUser | null>;
    findById(id: string): Promise<AuthUser | null>;

    incrementFailedAttempts(userId: string): Promise<void>;
    resetFailedAttempts(userId: string): Promise<void>;
    lockAccount(userId: string, until: Date): Promise<void>;

    saveSession(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
    findValidSession(userId: string): Promise<AuthSession[]>;
    revokeSession(sessionId: string): Promise<void>;

    updatePassword(userId: string, passwordHash: string): Promise<void>;

    createResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
    findValidResetToken(tokenHash: string): Promise<PasswordResetToken | null>;
    findSessionByTokenHash(tokenHash: string): Promise<AuthSession | null>;
    markResetTokenUsed(id: string): Promise<void>;

    createLoginAudit(
        userId: string | null,
        identifier: string,
        success: boolean,
        ip: string | null,
        userAgent: string | null,
    ): Promise<void>;
}