//Files: src/modules/auth/domain/rules/AccountLockRule.ts
import type { AuthUser } from "@/modules/auth/domain/entity/AuthUser";
import { FIFTEEN_MINUTES, MAX_FAILED_ATTEMPTS } from "@/libs/utils";

/**
 * =====================================================
 * ACCOUNT LOCK RULE
 * =====================================================
 * Pure domain rule (tanpa state)
 * =====================================================
 */

/**
 * Validasi apakah user masih terkunci
 */
export function canLogin(user: AuthUser): void {
  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new Error(`Akun terkunci sampai ${user.lockUntil.toISOString()}`);
  }
}

/**
 * Hitung waktu lock berdasarkan jumlah gagal login
 */
export function calculateLock(failedAttempts: number): Date | null {
  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    return new Date(Date.now() + FIFTEEN_MINUTES);
  }

  return null;
}
