//Files: src/modules/shared/core/bcrypt.ts

import bcrypt from "bcryptjs";

/**
 * ============================
 * BCRYPT HELPER
 * ============================
 * Centralized password hashing & comparison
 */

const SALT_ROUNDS = 10;

/**
 * Hash plain password
 */
export async function hashPassword(
    plainPassword: string,
): Promise<string> {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare plain password with hashed password
 */
export async function comparePassword(
    plainPassword: string,
    hashedPassword: string,
): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}