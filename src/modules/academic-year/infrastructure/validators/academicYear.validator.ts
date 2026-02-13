//Files: src/modules/academic-year/infrastructure/validators/academicYear.validator.ts
import { z } from "zod";

/**
 * ================================
 * CREATE ACADEMIC YEAR
 * ================================
 * POST /api/academic-years
 */
export const CreateAcademicYearSchema = z.object({
    name: z
        .string()
        .min(5, "Nama tahun ajaran minimal 5 karakter")
        .max(20, "Nama tahun ajaran maksimal 20 karakter"),
});

/**
 * ================================
 * UPDATE ACADEMIC YEAR
 * ================================
 * PUT /api/academic-years/:id
 */
export const UpdateAcademicYearSchema = z.object({
    name: z
        .string()
        .min(5, "Nama tahun ajaran minimal 5 karakter")
        .max(20, "Nama tahun ajaran maksimal 20 karakter"),
});
