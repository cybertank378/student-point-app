//Files: src/modules/rombel/infrastructure/validators/rombel.validator.ts

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
 * Catatan:
 * - AcademicYear adalah ROOT ENTITY
 * - Validasi FK dilakukan di module yang MEMAKAI (rombel)
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

    academicYearId: AcademicYearIdSchema,
});

/**
 * ================================
 * UPDATE ROMBEL
 * ================================
 * PUT /api/rombels/:id
 *
 * NOTE:
 * - id diambil dari URL
 */
export const UpdateRombelSchema = z.object({
    grade: GradeSchema,
    name: z.string().min(1).max(5),
    academicYearId: AcademicYearIdSchema,
});

