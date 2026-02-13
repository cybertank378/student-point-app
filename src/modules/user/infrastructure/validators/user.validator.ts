//Files: src/modules/user/infrastructure/validators/user.validator.ts
import { z } from "zod";

/**
 * =====================================================
 * ENUMS (SYNC WITH PRISMA)
 * =====================================================
 */

export const TeacherRoleEnum = z.enum([
    "SUBJECT_TEACHER",
    "HOMEROOM",
    "COUNSELOR",
    "DUTY_TEACHER",
]);

export const RoleEnum = z.enum([
    "ADMIN",
    "PARENT",
    "STUDENT",
    "TEACHER",
]);

/**
 * =====================================================
 * CREATE USER
 * =====================================================
 */
export const CreateUserSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(6),

    // ✅ SINGLE ROLE
    role: RoleEnum,

    // ✅ ARRAY ONLY FOR TEACHER ROLE
    teacherRoles: z
        .array(TeacherRoleEnum)
        .optional(),
});

/**
 * =====================================================
 * UPDATE USER
 * =====================================================
 */
export const UpdateUserSchema = z.object({
    username: z.string().min(4).optional(),
    password: z.string().min(6).optional(),

    // ✅ SINGLE ROLE
    role: RoleEnum.optional(),

    teacherRoles: z
        .array(TeacherRoleEnum)
        .optional(),

    isActive: z.boolean().optional(),
});
