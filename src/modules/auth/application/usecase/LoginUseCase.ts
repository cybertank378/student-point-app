//Files: src/modules/auth/application/usecase/LoginUseCase.ts

import { SEVEN_DAYS } from "@/libs/utils";
import { serverLog } from "@/libs/serverLogger";

import {
  canLogin,
  calculateLock,
} from "@/modules/auth/domain/rules/AccountLockRule";

import type { AuthRepositoryInterface } from "@/modules/auth/domain/interfaces/AuthRepositoryInterface";
import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";
import type { TokenServiceInterface } from "@/modules/auth/domain/interfaces/TokenServiceInterface";

import {
  AccountLockedError,
  InvalidCredentialsError,
} from "@/modules/auth/domain/error/AuthErrors";

export class LoginUseCase {
  constructor(
    private readonly repo: AuthRepositoryInterface,
    private readonly hash: HashServiceInterface,
    private readonly token: TokenServiceInterface,
  ) {}

  async execute(
    username: string,
    password: string,
    ip: string | null,
    userAgent: string | null,
  ) {
    serverLog("Login attempt", { username, ip, userAgent });

    const user = await this.repo.findByUsername(username);

    if (!user) {
      serverLog("Login failed - user not found", { username, ip });
      throw new InvalidCredentialsError();
    }

    /* =====================================================
           ACCOUNT LOCK CHECK (Domain Rule)
        ===================================================== */

    try {
      canLogin(user);
    } catch {
      serverLog("Login blocked - account locked", {
        userId: user.id,
        lockedUntil: user.lockUntil,
      });

      throw new AccountLockedError(user.lockUntil!);
    }

    /* =====================================================
           PASSWORD VALIDATION
        ===================================================== */

    const valid = await this.hash.compare(password, user.password);

    if (!valid) {
      // 1️⃣ Increment counter
      await this.repo.incrementFailedAttempts(user.id);

      // 2️⃣ Hitung lock time
      const failedAttempts = user.failedAttempts + 1;
      const lockUntil = calculateLock(failedAttempts);

      // 3️⃣ Lock account jika perlu
      if (lockUntil) {
        await this.repo.lockAccount(user.id, lockUntil);
      }

      await this.repo.createLoginAudit(null, username, false, ip, userAgent);

      serverLog("Login failed - invalid password", {
        userId: user.id,
        ip,
      });

      throw new InvalidCredentialsError();
    }

    /* =====================================================
           SUCCESS LOGIN
        ===================================================== */

    await this.repo.resetFailedAttempts(user.id);

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      teacherRole: user.teacherRole,
    };

    const accessToken = await this.token.generateAccessToken(payload);

    const refreshToken = await this.token.generateRefreshToken(payload);

    const hashRefresh = await this.hash.hash(refreshToken);

    await this.repo.saveSession(
      user.id,
      hashRefresh,
      new Date(Date.now() + SEVEN_DAYS),
    );

    await this.repo.createLoginAudit(user.id, username, true, ip, userAgent);

    serverLog("Login success", {
      userId: user.id,
      username: user.username,
      role: user.role,
      teacherRole: user.teacherRole,
      ip,
    });

    return {
      accessToken,
      refreshToken,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    };
  }
}
