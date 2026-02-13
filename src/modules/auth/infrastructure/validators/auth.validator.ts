//Files: src/modules/auth/infrastructure/validators/auth.validator.ts

import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
});

export const requestResetSchema = z.object({
    username: z.string().min(3),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(10),
    newPassword: z.string().min(6),
});
