//Files: src/modules/violation/infrastructur/validators/violationMaster.validator.ts

import { z } from "zod";

/**
 * ================================
 * CREATE MASTER VIOLATION
 * ================================
 * POST /api/violations-master
 */
export const CreateViolationSchema = z.object({
    name: z
        .string()
        .min(1, "Nama pelanggaran wajib diisi")
        .min(3, "Nama pelanggaran minimal 3 karakter")
        .max(100, "Nama pelanggaran maksimal 100 karakter"),

    point: z
        .number()
        .int("Point harus bilangan bulat")
        .min(10, "Minimal 10 poin")
        .max(100, "Maksimal 100 poin"),
});

/**
 * ================================
 * UPDATE MASTER VIOLATION
 * ================================
 * PUT /api/violations-master/:id
 *
 * NOTE:
 * - id diambil dari URL, BUKAN body
 */
export const UpdateViolationSchema = z.object({
    name: z
        .string()
        .min(1, "Nama pelanggaran wajib diisi")
        .min(3, "Nama pelanggaran minimal 3 karakter")
        .max(100, "Nama pelanggaran maksimal 100 karakter"),

    point: z
        .number()
        .int("Point harus berupa bilangan bulat")
        .positive("Point harus bernilai positif"),
});

