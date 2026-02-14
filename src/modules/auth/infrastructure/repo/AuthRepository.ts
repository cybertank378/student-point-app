//Files: src/modules/auth/infrastructure/repo/AuthRepository.ts

import type { AuthRepositoryInterface } from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import prisma from "@/libs/prisma";
import type { AuthUser } from "@/modules/auth/domain/entity/AuthUser";
import { AuthMapper } from "@/modules/auth/domain/mapper/AuthMapper";
import type { PasswordResetToken } from "@/modules/auth/domain/entity/PasswordResetToken";
import type { AuthSession } from "@/modules/auth/domain/entity/AuthSession";
import { FIFTEEN_MINUTES } from "@/libs/utils";

export class AuthRepository implements AuthRepositoryInterface {
  async findByUsername(username: string): Promise<AuthUser | null> {
    const data = await prisma.user.findUnique({
      where: { username },
      include: {
        teacher: {
          select: {
            roles: true,
          },
        },
      },
    });

    if (!data) return null;

    return AuthMapper.toDomainUser(data);
  }

  async findById(id: string): Promise<AuthUser | null> {
    const data = await prisma.user.findUnique({
      where: { id },
    });

    if (!data) return null;

    return AuthMapper.toDomainUser(data);
  }

  async incrementFailedAttempts(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        failedAttempts: true,
        lockUntil: true,
      },
    });

    if (!user) return;

    const attempts = user.failedAttempts + 1;

    const lockUntil =
      attempts >= 5 ? new Date(Date.now() + FIFTEEN_MINUTES) : user.lockUntil;

    await prisma.user.update({
      where: { id: userId },
      data: {
        failedAttempts: attempts,
        lockUntil,
      },
    });
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedAttempts: 0,
        lockUntil: null,
      },
    });
  }

  async lockAccount(userId: string, until: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lockUntil: until },
    });
  }

  async saveSession(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await prisma.authSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async findValidSession(userId: string): Promise<AuthSession[]> {
    const sessions = await prisma.authSession.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    return sessions.map(AuthMapper.toDomainSession);
  }

  async revokeSession(sessionId: string): Promise<void> {
    await prisma.authSession.update({
      where: { id: sessionId },
      data: { revoked: true },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        mustChangePassword: false,
      },
    });
  }

  async createResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async findValidResetToken(
    tokenHash: string,
  ): Promise<PasswordResetToken | null> {
    const token = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!token) return null;

    return AuthMapper.toDomainResetToken(token);
  }

  async markResetTokenUsed(id: string): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { id },
      data: { used: true },
    });
  }

  async createLoginAudit(
    userId: string | null,
    identifier: string,
    success: boolean,
    ip: string | null,
    userAgent: string | null,
  ): Promise<void> {
    await prisma.loginAudit.create({
      data: {
        userId,
        identifier,
        success,
        ip,
        userAgent,
      },
    });
  }

  async findSessionByTokenHash(tokenHash: string): Promise<AuthSession | null> {
    const session = await prisma.authSession.findFirst({
      where: {
        tokenHash,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) return null;

    return AuthMapper.toDomainSession(session);
  }
}
