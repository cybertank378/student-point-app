// Files: src/modules/teacher/infrastructure/validators/teacher.validator.ts

import { z } from "zod";
import { id } from "zod/locales"

import { TeacherRole } from "@/generated/prisma";
import { teacherSortFields } from "@/modules/teacher/domain/dto/ListTeacherRespDTO";
import {BaseTeacherSchema, TeacherObjectSchema, teacherRefinement} from "./base.validator";

/* ============================================================
   ZOD CONFIG
   ============================================================ */

z.config(id());

/* ============================================================
   LIST (PAGINATION)
   ============================================================ */

export const ListTeacherSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
});

/* ============================================================
   SEARCH (ADVANCED FILTER)
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
   CREATE
   ============================================================ */

export const CreateTeacherSchema = BaseTeacherSchema;

/* ============================================================
   UPDATE
   ============================================================ */

export const UpdateTeacherSchema =
    TeacherObjectSchema
        .partial()
        .superRefine(teacherRefinement);


/* ============================================================
   ASSIGN ROLE
   ============================================================ */

export const AssignTeacherRoleSchema = z.object({
    roles: z.array(z.enum(TeacherRole)).min(1),
});

/* ============================================================
   ASSIGN HOMEROOM
   ============================================================ */

export const AssignHomeroomSchema = z.object({
    teacherId: z.string().min(1),
    classId: z.string().min(1),
});

/* ============================================================
   IMPORT (BULK)
   ============================================================ */

export const ImportTeacherSchema = z.array(BaseTeacherSchema);
