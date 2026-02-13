//Files: src/modules/teacher/infrastructure/validators/teacher.validator.ts

import { z } from "zod";
import { TeacherRole } from "@/generated/prisma";
import {TEACHER_ROLES} from "@/modules/teacher/domain/constants/TeacherRole";
import {UUID_REGEX} from "@/modules/shared/http/getRouteParam";
import {EMAIL_REGEX} from "valibot";

export const TeacherRoleEnum = z.enum(TEACHER_ROLES);

export const CreateTeacherSchema = z.object({
    userId: z.string().uuid(),
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
    classId: z.string().regex(UUID_REGEX),
});
