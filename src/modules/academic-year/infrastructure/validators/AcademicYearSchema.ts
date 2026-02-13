//Files: src/modules/academic-year/infrastructure/validators/AcademicYearSchema.ts
import { z } from "zod";

/**
 * ===============================
 * BASE SCHEMA
 * ===============================
 */
const BaseAcademicYearSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(
                5,
                "Nama tahun ajaran minimal 5 karakter",
            )
            .max(
                20,
                "Nama tahun ajaran maksimal 20 karakter",
            ),

        startDate: z
            .string()
            .min(
                1,
                "Tanggal mulai wajib diisi",
            )
            .transform((val) => {
                const date = new Date(val);

                if (isNaN(date.getTime())) {
                    throw new Error(
                        "Format tanggal mulai tidak valid",
                    );
                }

                return date;
            }),

        endDate: z
            .string()
            .min(
                1,
                "Tanggal selesai wajib diisi",
            )
            .transform((val) => {
                const date = new Date(val);

                if (isNaN(date.getTime())) {
                    throw new Error(
                        "Format tanggal selesai tidak valid",
                    );
                }

                return date;
            }),
    })
    .refine(
        (data) =>
            data.startDate <= data.endDate,
        {
            message:
                "Tanggal selesai harus setelah tanggal mulai",
            path: ["endDate"],
        },
    );

/**
 * ===============================
 * CREATE SCHEMA
 * ===============================
 */
export const CreateAcademicYearSchema =
    BaseAcademicYearSchema;

/**
 * ===============================
 * UPDATE SCHEMA
 * ===============================
 * Untuk update, kita tidak perlu id di body
 */
export const UpdateAcademicYearSchema =
    BaseAcademicYearSchema;

/**
 * ===============================
 * TYPES (AUTO GENERATED FROM ZOD)
 * ===============================
 */
export type CreateAcademicYearInput =
    z.infer<typeof CreateAcademicYearSchema>;

export type UpdateAcademicYearInput =
    z.infer<typeof UpdateAcademicYearSchema>;
