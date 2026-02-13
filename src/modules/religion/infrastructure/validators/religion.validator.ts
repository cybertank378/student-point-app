//Files: src/modules/religion/infrastructure/validators/religion.validator.ts

import { z } from "zod";

export const CreateReligionSchema = z.object({
    kode: z
        .string()
        .min(1, "Kode wajib diisi")
        .max(10, "Kode maksimal 10 karakter"),

    name: z
        .string()
        .min(3, "Nama agama minimal 3 karakter")
        .max(50, "Nama agama maksimal 50 karakter"),
});

export const UpdateReligionSchema = z.object({
    kode: z
        .string()
        .min(1)
        .max(10),

    name: z
        .string()
        .min(3)
        .max(50),
});
