//Files: src/modules/user/infrastructure/validators/user.validator.ts
import { z } from "zod";
import {UUID_REGEX} from "@/libs/utils";

/**
 * UUID Schema
 * - Tidak menggunakan overload deprecated
 * - Compatible dengan Zod v4+
 */
export const UUIDSchema = z.string().regex(UUID_REGEX);


/**
 * =====================================================
 * ENUMS (SYNC WITH DOMAIN)
 * =====================================================
 */

export const TeacherRoleEnum = z.enum([
    "SUBJECT_TEACHER",
    "HOMEROOM",
    "COUNSELOR",
    "DUTY_TEACHER",
]);

export const RoleEnum = z.enum([
    "ADMIN",
    "PARENT",
    "STUDENT",
    "TEACHER",
]);

/**
 * =====================================================
 * LIST USER
 * =====================================================
 */

export const ListUserSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
});

/**
 * =====================================================
 * CREATE USER
 * =====================================================
 */

export const CreateUserSchema = z
    .object({
        role: RoleEnum.refine(
            (val) => val !== "ADMIN",
            "Tidak dapat membuat ADMIN melalui endpoint ini."
        ),

        referenceId: UUIDSchema,

        teacherRole: TeacherRoleEnum.optional(),
    })
    .superRefine((data, ctx) => {
        if (data.role === "TEACHER" && !data.teacherRole) {
            ctx.addIssue({
                code: "custom", // ✅ Zod v4 correct usage
                message: "Teacher wajib memiliki teacherRole.",
                path: ["teacherRole"],
            });
        }
    });

/**
 * =====================================================
 * UPDATE USER
 * =====================================================
 */

export const UpdateUserSchema = z.object({
    password: z.string().min(6).optional(),

    role: RoleEnum,

    teacherRole: TeacherRoleEnum.nullable(),

    image: z.string().trim().nullable().optional(),

    // 🔥 HARUS optional, bukan nullable
    referenceId: UUIDSchema.optional(),

    isActive: z.boolean(),
}).superRefine((data, ctx) => {
    if (data.role === "TEACHER" && !data.teacherRole) {
        ctx.addIssue({
            code: "custom",
            message: "Teacher wajib memiliki teacherRole.",
            path: ["teacherRole"],
        });
    }
});
