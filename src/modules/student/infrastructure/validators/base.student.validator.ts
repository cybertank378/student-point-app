// Files: src/modules/shared/validators/base.student.validator.ts
import { z } from "zod";
import { EMAIL_REGEX, UUID_REGEX } from "@/libs/utils";
import { FamilyStatus, Gender } from "@/libs/utils/enums";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 * BaseStudentValidator
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Schema dasar validasi Student yang mengikuti
 * struktur StudentEntity pada Domain Layer.
 *
 * Schema ini digunakan ulang oleh validator
 * untuk berbagai endpoint Student.
 *
 * ============================================================
 * PARAM
 * ============================================================
 * Tidak ada
 *
 * ============================================================
 * RETURNS
 * ============================================================
 * Zod Schema
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 * CreateStudentSchema.extend(...)
 */

export const BaseIdSchema = z.string().regex(UUID_REGEX);

export const BaseNisnSchema = z.string().max(10);

export const BaseStudentSchema = z.object({
  nis: z.string().nullable(),

  nisn: BaseNisnSchema,

  name: z.string().min(2),

  nickname: z.string().nullable(),

  gender: z.enum(Gender),

  photo: z.string().nullable(),

  birthPlace: z.string(),

  birthDate: z.coerce.date(),

  address: z.string(),

  phone: z.string().nullable(),

  email: z.string().regex(EMAIL_REGEX).nullable(),

  religionCode: z.string(),

  nik: z.string().max(16).nullable(),

  kkNumber: z.string().max(16).nullable(),

  schoolOrigin: z.string().nullable(),

  graduationScore: z.number().nullable(),

  instagram: z.string().nullable(),

  familyStatus: z.enum(FamilyStatus),

  isDifable: z.boolean(),

  difableNotes: z.string().nullable(),
});
