//Files: src/modules/teacher/infrastructure/validators/base.validator.ts
// Files: src/modules/teacher/infrastructure/validators/base.validator.ts

import {
    Gender,
    EducationLevel,
    CivilServantRank,
    TeacherRole,
} from "@/generated/prisma";

import { z } from "zod";
import { id } from "zod/locales";

z.config(id());

//////////////////////////////////////////////////////
// ENUM VALIDATION
//////////////////////////////////////////////////////

export const GenderEnum = z.enum(Gender);
export const EducationLevelEnum = z.enum(EducationLevel);
export const CivilServantRankEnum = z.enum(CivilServantRank);
export const TeacherRoleEnum = z.enum(TeacherRole);

//////////////////////////////////////////////////////
// REUSABLE FIELD SCHEMAS
//////////////////////////////////////////////////////

export const NipSchema = z
    .string()
    .regex(/^\d{18}$/, "NIP harus 18 digit angka")
    .nullable()
    .optional();

export const NuptkSchema = z
    .string()
    .regex(/^\d{16}$/, "NUPTK harus 16 digit angka")
    .nullable()
    .optional();

export const NrkSchema = z
    .string()
    .regex(/^\d{8}$/, "NRK harus 8 digit angka")
    .nullable()
    .optional();

export const NrgSchema = z
    .number()
    .int()
    .min(100000000000)
    .max(999999999999);

export const PhoneSchema = z
    .string()
    .regex(/^08\d{8,11}$/, "Nomor HP tidak valid (format Indonesia)")
    .nullable()
    .optional();

export const EmailSchema = z
    .string()
    .email("Format email tidak valid")
    .nullable()
    .optional();

export const PhotoSchema = z
    .string()
    .url("Photo harus berupa URL valid")
    .nullable()
    .optional();

//////////////////////////////////////////////////////
// PURE OBJECT SCHEMA (NO REFINEMENT)
//////////////////////////////////////////////////////

export const TeacherObjectSchema = z.object({
    nip: NipSchema,
    nuptk: NuptkSchema,
    nrk: NrkSchema,
    nrg: NrgSchema,

    name: z
        .string()
        .min(3, "Nama minimal 3 karakter")
        .max(100, "Nama maksimal 100 karakter"),

    gender: GenderEnum,

    religionCode: z.string().min(1, "Kode agama wajib diisi"),

    phone: PhoneSchema,
    email: EmailSchema,
    photo: PhotoSchema,

    educationLevel: EducationLevelEnum,

    major: z
        .string()
        .min(2, "Jurusan minimal 2 karakter")
        .nullable()
        .optional(),

    graduationYear: z
        .number()
        .int()
        .min(1950, "Tahun kelulusan tidak valid")
        .max(
            new Date().getFullYear(),
            "Tahun kelulusan tidak boleh melebihi tahun sekarang"
        ),

    birthPlace: z
        .string()
        .min(2, "Tempat lahir minimal 2 karakter"),

    birthDate: z.coerce.date(),

    civilServantRank: CivilServantRankEnum
        .nullable()
        .optional(),

    roles: z
        .array(TeacherRoleEnum)
        .min(1, "Minimal memiliki 1 role"),

    isPns: z.boolean().default(false),
});

//////////////////////////////////////////////////////
// STRICT TYPED REFINEMENT
//////////////////////////////////////////////////////

type TeacherObjectInput = z.infer<typeof TeacherObjectSchema>;

type TeacherRefinementInput =
    Partial<z.infer<typeof TeacherObjectSchema>>;

export const teacherRefinement = (
    data: TeacherRefinementInput,
    ctx: z.RefinementCtx
) => {
    if (data.isPns === true && !data.civilServantRank) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["civilServantRank"],
            message: "PNS wajib memiliki pangkat",
        });
    }

    if (data.isPns === false && data.civilServantRank) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["civilServantRank"],
            message: "Non-PNS tidak boleh memiliki pangkat",
        });
    }
};

//////////////////////////////////////////////////////
// FINAL SCHEMAS
//////////////////////////////////////////////////////

export const BaseTeacherSchema =
    TeacherObjectSchema.superRefine(teacherRefinement);

export type BaseTeacherInput =
    z.infer<typeof BaseTeacherSchema>;
