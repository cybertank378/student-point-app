//Files: src/modules/rombel/infrastructure/validators/rombel.validator.ts
// src/modules/rombel/infrastructure/validators/rombel.validator.ts

import { z } from "zod";

/**
 * ================================
 * GRADE (ROMAWI)
 * ================================
 */
export const GradeSchema = z
    .string()
    .regex(
        /^(VII|VIII|IX)$/,
        "Grade harus salah satu dari: VII, VIII, IX",
    );

/**
 * ================================
 * ACADEMIC YEAR ID (FK)
 * ================================
 * - FK ke AcademicYear
 * - Validasi relasi dilakukan di service / repository
 */
export const AcademicYearIdSchema = z
    .string()
    .min(1, "Academic year wajib diisi");

/**
 * ================================
 * CREATE ROMBEL
 * ================================
 * POST /api/rombels
 */
export const CreateRombelSchema = z.object({
    grade: GradeSchema,

    name: z
        .string()
        .min(1, "Nama rombel wajib diisi")
        .max(5, "Nama rombel maksimal 5 karakter"),

    academicYearId: AcademicYearIdSchema, // ✅ FIXED
});

/**
 * ================================
 * UPDATE ROMBEL
 * ================================
 * PUT /api/rombels/:id
 *
 * NOTE:
 * - id diambil dari URL param
 */
export const UpdateRombelSchema = z.object({
    grade: GradeSchema,

    name: z
        .string()
        .min(1, "Nama rombel wajib diisi")
        .max(5, "Nama rombel maksimal 5 karakter"),

    academicYearId: AcademicYearIdSchema, // ✅ FIXED
});
