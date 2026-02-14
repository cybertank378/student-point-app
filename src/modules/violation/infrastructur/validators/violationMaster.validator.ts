//Files: src/modules/violation/infrastructur/validators/violationMaster.validator.ts
import { z } from "zod";

/* ======================================================
   ENUM
====================================================== */

export const ViolationLevelEnum = z.enum([
    "LIGHT",
    "MEDIUM",
    "HEAVY",
]);

export type ViolationLevel =
    z.infer<typeof ViolationLevelEnum>;

/* ======================================================
   BASE SCHEMA
====================================================== */

const BaseViolationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Nama pelanggaran wajib diisi" })
        .min(3, { message: "Nama pelanggaran minimal 3 karakter" })
        .max(100, { message: "Nama pelanggaran maksimal 100 karakter" }),

    point: z
        .number()
        .int({ message: "Point harus bilangan bulat" })
        .min(10, { message: "Minimal 10 poin" })
        .max(100, { message: "Maksimal 100 poin" }),

    level: ViolationLevelEnum,
});

/* ======================================================
   CREATE
====================================================== */

export const CreateViolationSchema =
    BaseViolationSchema;

export type CreateViolationInput =
    z.infer<typeof CreateViolationSchema>;

/* ======================================================
   UPDATE
====================================================== */

export const UpdateViolationSchema =
    BaseViolationSchema;

export type UpdateViolationInput =
    z.infer<typeof UpdateViolationSchema>;


