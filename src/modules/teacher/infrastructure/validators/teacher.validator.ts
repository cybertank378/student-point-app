// Files: src/modules/teacher/infrastructure/validators/teacher.validator.ts

import { z } from "zod";
import { id } from "zod/locales";
import { TeacherRole } from "@/generated/prisma";
import { teacherSortFields } from "@/modules/teacher/domain/dto/ListTeacherRespDTO";
import {
    CreateTeacherSchema,
    UpdateTeacherSchema,
} from "./base.validator";

z.config(id());

/* ============================================================
   LIST
============================================================ */

export const ListTeacherSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
});

/* ============================================================
   SEARCH
============================================================ */

export const SearchTeacherSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),

    name: z.string().trim().optional(),
    role: z.enum(TeacherRole).optional(),
    religionCode: z.string().optional(),

    sortBy: z.enum(teacherSortFields).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

/* ============================================================
   CREATE / UPDATE
============================================================ */

export { CreateTeacherSchema, UpdateTeacherSchema };

/**
 * ============================================================
 * BULK ASSIGN TEACHER ROLE SCHEMA
 * ============================================================
 *
 * Modern scalable API contract.
 */
export const AssignTeacherRoleBulkSchema = z.object({
    teacherIds: z.array(z.string().min(1)).min(1),
    roles: z.array(z.enum(TeacherRole)).min(1),
});

/**
 * ============================================================
 * SINGLE ASSIGN TEACHER ROLE SCHEMA
 * ============================================================
 *
 * Backward compatible format.
 */
export const AssignTeacherRoleSingleSchema = z.object({
    roles: z.array(z.enum(TeacherRole)).min(1),
});

/**
 * ============================================================
 * BULK ASSIGN HOMEROOM SCHEMA
 * ============================================================
 */
export const AssignHomeroomBulkSchema = z.object({
    teacherIds: z.array(z.string().min(1)).min(1),
    rombelIds: z.array(z.string().min(1)).min(1),
});

/**
 * ============================================================
 * SINGLE ASSIGN HOMEROOM SCHEMA
 * ============================================================
 *
 * Backward compatibility.
 */
export const AssignHomeroomSingleSchema = z.object({
    teacherId: z.string().min(1),
    classId: z.string().min(1),
});

/* ============================================================
   IMPORT
============================================================ */

export const ImportTeacherSchema =
    z.array(CreateTeacherSchema);