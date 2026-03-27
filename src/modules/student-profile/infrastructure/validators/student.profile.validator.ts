//Files: src/modules/student-profile/infrastructure/validators/student.profile.validator.ts

import { z } from "zod"
import { BaseStudentProfileSchema } from "@/modules/student-profile/infrastructure/validators/base.student.profile.validator"
import {UUID_REGEX} from "valibot";
/**
 * ============================================================
 * CREATE STUDENT PROFILE SCHEMA
 * ============================================================
 */

export const CreateStudentProfileSchema = BaseStudentProfileSchema.strict()

/**
 * ============================================================
 * UPDATE STUDENT PROFILE SCHEMA
 * ============================================================
 *
 * studentId required
 * other fields optional
 */

export const UpdateStudentProfileSchema =
    BaseStudentProfileSchema
        .omit({ studentId: true })
        .partial()
        .extend({

            studentId: z
                .string()
                .regex(UUID_REGEX, "Invalid UUID format")

        })
        .strict()

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

export type CreateStudentProfileInput = z.infer<typeof CreateStudentProfileSchema>

export type UpdateStudentProfileInput = z.infer<typeof UpdateStudentProfileSchema>