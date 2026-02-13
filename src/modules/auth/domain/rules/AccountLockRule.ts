//Files: src/modules/auth/domain/rules/AccountLockRule.ts

import {AuthUser} from "@/modules/auth/domain/entity/AuthUser";
import {FIFTEEN_MINUTES, MAX_FAILED_ATTEMPTS} from "@/libs/utils";


export class AccountLockRule {
    static canLogin(user: AuthUser): void {
        if (
            user.lockUntil &&
            user.lockUntil > new Date()
        ) {
            throw new Error(
                `Akun terkunci sampai ${user.lockUntil.toISOString()}`,
            );
        }
    }

    static calculateLock(
        failedAttempts: number,
    ): Date | null {
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            return new Date(
                Date.now() + FIFTEEN_MINUTES,
            );
        }

        return null;
    }
}