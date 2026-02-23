// Files: src/modules/teacher/infrastructure/validators/base.validator.ts

import {CivilServantRank, EducationLevel, Gender, TeacherRole,} from "@/generated/prisma";

import {z} from "zod";
import {id} from "zod/locales";
import {EMAIL_REGEX} from "@/libs/utils";

z.config(id());


const emptyToNull = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess(
        (val) => (val === "" ? null : val),
        schema
    );


/* ============================================================
   ENUM VALIDATION
============================================================ */

export const GenderEnum = z.enum(Gender);
export const EducationLevelEnum = z.enum(EducationLevel);
export const CivilServantRankEnum = z.enum(CivilServantRank);
export const TeacherRoleEnum = z.enum(TeacherRole);


/* ============================================================
   NIP (18 DIGIT)
============================================================ */
export const NipSchema = emptyToNull(
    z
        .string()
        .trim()
        .regex(/^\d{18}$/, "NIP harus 18 digit angka")
        .nullable()
        .optional()
);
/* ============================================================
   NUPTK (16 DIGIT)
============================================================ */
export const NuptkSchema = emptyToNull(
    z
        .string()
        .trim()
        .regex(/^\d{16}$/, "NUPTK harus 16 digit angka")
        .nullable()
        .optional()
);

/* ============================================================
   NRK (6 DIGIT) — sesuaikan jika memang 6 digit
============================================================ */
export const NrkSchema = emptyToNull(
    z
        .string()
        .trim()
        .regex(/^\d{6}$/, "NRK harus 6 digit angka")
        .nullable()
        .optional()
);

/* ============================================================
   NRG (12 DIGIT) — REQUIRED
============================================================ */
export const NrgSchema = z
    .string()
    .trim()
    .regex(/^\d{12}$/, "NRG harus 12 digit angka");


export const PhoneSchema = emptyToNull(
    z
        .string()
        .regex(/^08\d{8,11}$/, "Nomor HP tidak valid")
        .nullable()
        .optional()
);

export const EmailSchema = emptyToNull(
    z
        .string()
        .email("Format email tidak valid")
        .nullable()
        .optional()
);

export const PhotoSchema = emptyToNull(
    z
        .string()
        .trim()
        .nullable()
        .optional()
);

/* ============================================================
   BASE OBJECT (NO REFINEMENT)
============================================================ */

export const TeacherObjectSchema = z.object({
    nip: NipSchema,
    nuptk: NuptkSchema,
    nrk: NrkSchema,
    nrg: NrgSchema,

    name: z.string().min(3).max(100),
    gender: GenderEnum,
    religionCode: z.string().min(1),

    phone: PhoneSchema,
    email: EmailSchema,
    photo: PhotoSchema,

    educationLevel: EducationLevelEnum,

    major: emptyToNull(
        z.string().min(2).nullable().optional()
    ),

    graduationYear: z
        .number()
        .int()
        .min(1950)
        .max(new Date().getFullYear()),

    birthPlace: z.string().min(2),
    birthDate: z.coerce.date(),

    civilServantRank: CivilServantRankEnum
        .nullable()
        .optional(),

    roles: z.array(TeacherRoleEnum).min(1),

    isPns: z.boolean().default(false),

    homeroomClassIds: z
        .array(z.string().uuid())
        .optional()
        .default([]),
});

/* ============================================================
   REFINEMENT
============================================================ */

export const teacherRefinement = (
    data: Partial<z.infer<typeof TeacherObjectSchema>>,
    ctx: z.RefinementCtx
) => {
    if (data.isPns === true) {
        if (!data.civilServantRank) {
            ctx.addIssue({
                code: "custom",
                path: ["civilServantRank"],
                message: "PNS wajib memiliki pangkat",
            });
        }

        if (!data.nip) {
            ctx.addIssue({
                code: "custom",
                path: ["nip"],
                message: "PNS wajib memiliki NIP",
            });
        }

        if (!data.nrk) {
            ctx.addIssue({
                code: "custom",
                path: ["nrk"],
                message: "PNS wajib memiliki NRK",
            });
        }
    }

    if (data.isPns === false) {
        if (data.civilServantRank) {
            ctx.addIssue({
                code: "custom",
                path: ["civilServantRank"],
                message: "Non-PNS tidak boleh memiliki pangkat",
            });
        }

        if (data.nip) {
            ctx.addIssue({
                code: "custom",
                path: ["nip"],
                message: "Non-PNS tidak boleh memiliki NIP",
            });
        }

        if (data.nrk) {
            ctx.addIssue({
                code: "custom",
                path: ["nrk"],
                message: "Non-PNS tidak boleh memiliki NRK",
            });
        }
    }
};

/* ============================================================
   CREATE SCHEMA (STRICT)
============================================================ */

export const CreateTeacherSchema =
    TeacherObjectSchema.superRefine(teacherRefinement);

/* ============================================================
   UPDATE SCHEMA (PARTIAL SAFE)
============================================================ */

export const UpdateTeacherSchema =
    TeacherObjectSchema
        .partial()
        .superRefine(teacherRefinement);