//Files: src/modules/teacher/infrastructure/validators/teacher.validator.ts

import { z } from "zod";
import {EMAIL_REGEX, TEACHER_ROLES, UUID_REGEX} from "@/libs/utils";

export const TeacherRoleEnum = z.enum(TEACHER_ROLES);

export const UuidSchema = z.string().regex(UUID_REGEX, "Invalid UUID v4");

/* ============================================================
   OPTIONAL: BRANDED TYPE (STRONGER TYPE SAFETY)
============================================================ */
export const CreateTeacherSchema = z.object({
    userId: UuidSchema,
    nip: z.string().min(5),
    name: z.string().min(3),
    phone: z.string().optional(),
    email: z.string().regex(EMAIL_REGEX).optional(),
    roles: z.array(TeacherRoleEnum).min(1),
});

export const UpdateTeacherSchema = z.object({
    nip: z.string().min(5),
    name: z.string().min(3),
    phone: z.string().nullable().optional(),
    email: z.string().regex(EMAIL_REGEX).nullable().optional(),
    roles: z.array(TeacherRoleEnum).min(1),
});

export const AssignTeacherRoleSchema = z.object({
    roles: z.array(TeacherRoleEnum).min(1),
});

export const AssignHomeroomSchema = z.object({
    classId: UuidSchema,
});
