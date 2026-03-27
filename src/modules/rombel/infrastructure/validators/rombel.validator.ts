//Files: src/modules/rombel/infrastructure/validators/RombelSchema.ts

import { z } from "zod";
import {UUID_REGEX} from "valibot";

/**
 * ============================================================
 * BASE ROMBEL SCHEMA
 * ============================================================
 */

const BaseRombelSchema = z.object({

    grade: z
        .string()
        .trim()
        .min(1, "Tingkat kelas wajib diisi")
        .max(10, "Tingkat kelas terlalu panjang"),

    name: z
        .string()
        .trim()
        .min(1, "Nama rombel wajib diisi")
        .max(10, "Nama rombel terlalu panjang"),

    academicYearId: z
        .string()
        .uuid("Academic year tidak valid"),

    homeroomTeacherId: z
        .string()
        .regex(UUID_REGEX, "Guru kelas harus berupa UUID")
        .nullable()
        .optional(),

});

/**
 * ============================================================
 * CREATE
 * ============================================================
 */

export const CreateRombelSchema = BaseRombelSchema;

/**
 * ============================================================
 * UPDATE
 * ============================================================
 */

export const UpdateRombelSchema = BaseRombelSchema;

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

export type CreateRombelInput =
    z.infer<typeof CreateRombelSchema>;

export type UpdateRombelInput =
    z.infer<typeof UpdateRombelSchema>;