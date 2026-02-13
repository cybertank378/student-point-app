//Files: src/modules/achievement/infrastructure/http/validators/achievementMaster.validator.ts

import { z } from "zod";

/**
 * ================================
 * CREATE MASTER ACHIEVEMENT
 * ================================
 * POST /api/achievements-master
 */
export const CreateAchievementSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Nama prestasi wajib diisi")
        .min(3, "Nama prestasi minimal 3 karakter")
        .max(100, "Nama prestasi maksimal 100 karakter"),

    point: z
        .number()
        .int("Point harus berupa bilangan bulat")
        .positive("Point harus bernilai positif"),
});

/**
 * ================================
 * UPDATE MASTER ACHIEVEMENT
 * ================================
 * PUT /api/achievements-master/:id
 *
 * NOTE:
 * - id diambil dari URL, BUKAN body
 */
export const UpdateAchievementSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Nama prestasi wajib diisi")
        .min(3, "Nama prestasi minimal 3 karakter")
        .max(100, "Nama prestasi maksimal 100 karakter"),

    point: z
        .number()
        .int("Point harus berupa bilangan bulat")
        .positive("Point harus bernilai positif"),
});
