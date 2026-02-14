//Files: src/modules/student/infrastructure/validators/student.validator.ts


import { z } from "zod";
import {UUID_REGEX} from "@/libs/utils";

/**
 * ==============================
 * ENUMS (HTTP LAYER)
 * ==============================
 */
export const GenderEnum = z.enum(["MALE", "FEMALE"]);

export const StudentStatusEnum = z.enum([
    "ACTIVE",
    "GRADUATED",
    "DROPPED",
    "MUTATION",
]);

/**
 * ==============================
 * CREATE STUDENT
 * ==============================
 */
export const CreateStudentSchema = z.object({
    nisn: z
        .number()
        .int("NISN harus bilangan bulat")
        .positive("NISN harus bernilai positif"),

    nis: z
        .number()
        .int("NIS harus bilangan bulat")
        .positive("NIS harus bernilai positif"),

    name: z
        .string()
        .min(3, "Nama minimal 3 karakter")
        .max(100, "Nama maksimal 100 karakter"),

    nickname: z
        .string()
        .min(2, "Nickname minimal 2 karakter")
        .max(50, "Nickname maksimal 50 karakter")
        .optional(),

    gender: GenderEnum,

    religionId: z
        .string()
        .regex(UUID_REGEX, "Religion ID tidak valid"),

    rombelId: z
        .string()
        .regex(UUID_REGEX, "Rombel ID tidak valid"),
});

/**
 * ==============================
 * UPDATE STUDENT
 * ==============================
 */
export const UpdateStudentSchema = z.object({
    name: z
        .string()
        .min(3)
        .max(100),

    nickname: z
        .string()
        .min(2)
        .max(50)
        .nullable()
        .optional(),

    gender: GenderEnum.optional(),

    religionId: z
        .string()
        .regex(UUID_REGEX)
        .optional(),

    rombelId: z
        .string()
        .regex(UUID_REGEX)
        .optional(),

    status: StudentStatusEnum.optional(),
});

/**
 * ==============================
 * QUERY STUDENT (LIST)
 * ==============================
 */
export const StudentQuerySchema = z.object({
    rombelId: z.string().regex(UUID_REGEX).optional(),

    status: StudentStatusEnum.optional(),

    page: z.coerce
        .number()
        .int()
        .positive()
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .positive()
        .default(10),
});

/**
 * ==============================
 * ASSIGN STUDENT → ROMBEL
 * ==============================
 */
export const AssignRombelSchema = z.object({
    studentId: z.string().regex(UUID_REGEX),
    rombelId: z.string().regex(UUID_REGEX),
});

/**
 * ==============================
 * BATCH ASSIGN → ROMBEL
 * ==============================
 */
export const BatchAssignRombelSchema = z.object({
    studentIds: z
        .array(z.string().regex(UUID_REGEX))
        .min(1, "Minimal 1 siswa"),

    rombelId: z.string().regex(UUID_REGEX),
});

