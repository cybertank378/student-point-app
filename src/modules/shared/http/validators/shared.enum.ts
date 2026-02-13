//Files: src/modules/shared/http/validators/shared.enum.ts

import { z } from "zod";

/**
 * ======================================
 * USER ROLE ENUM
 * ======================================
 */
export const UserRoleSchema = z
    .enum(["ADMIN", "STUDENT", "PARENT", "TEACHER"])
    .refine((val) => val !== undefined, {
        message: "Role tidak valid",
    });

/**
 * ======================================
 * TEACHER ROLE ENUM
 * ======================================
 */
export const TeacherRoleSchema = z
    .enum([
        "SUBJECT_TEACHER",
        "HOMEROOM",
        "COUNSELOR",
        "DUTY_TEACHER",
    ])
    .refine((val) => val !== undefined, {
        message: "Teacher role tidak valid",
    });

export type UserRole = z.infer<typeof UserRoleSchema>;
export type TeacherRole = z.infer<typeof TeacherRoleSchema>;

