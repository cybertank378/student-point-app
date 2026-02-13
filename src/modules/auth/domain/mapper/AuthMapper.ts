//Files: src/modules/auth/domain/mapper/AuthMapper.ts

import { User as PrismaUser } from '@/generated/prisma';
import { AuthSession as PrismaSession } from '@/generated/prisma';
import { PasswordResetToken as PrismaReset } from '@/generated/prisma';

import {AuthUser} from "@/modules/auth/domain/entity/AuthUser";
import {PasswordResetToken} from "@/modules/auth/domain/entity/PasswordResetToken";
import {AuthSession} from "@/modules/auth/domain/entity/AuthSession";

export class AuthMapper {
    static toDomainUser(data: PrismaUser): AuthUser {
        return new AuthUser(
            data.id,
            data.username,
            data.password,
            data.role,
            data.isActive,
            data.failedAttempts,
            data.lockUntil,
            data.mustChangePassword,
        );
    }

    static toDomainSession(data: PrismaSession,): AuthSession {
        return new AuthSession(
            data.id,
            data.userId,
            data.tokenHash,
            data.expiresAt,
            data.revoked,
        );
    }

    static toDomainResetToken(data: PrismaReset,): PasswordResetToken {
        return new PasswordResetToken(
            data.id,
            data.userId,
            data.tokenHash,
            data.expiresAt,
            data.used,
        );
    }
}
