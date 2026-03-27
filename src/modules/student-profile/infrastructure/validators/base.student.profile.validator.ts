//Files: src/modules/student-profile/infrastructure/validators/base.student.profile.validator.ts

import { z } from "zod"
import {UUID_REGEX} from "valibot";

/**
 * ============================================================
 * BASE STUDENT PROFILE SCHEMA
 * ============================================================
 *
 * Base schema used as the source of truth for
 * student profile validation.
 *
 * Other schemas (create/update) extend this schema.
 */

export const BaseStudentProfileSchema = z.object({

    studentId: z
        .string()
        .regex(UUID_REGEX, "Invalid UUID format"),

    childOrder: z
        .number()
        .int()
        .min(1)
        .optional(),

    totalSiblings: z
        .number()
        .int()
        .min(0)
        .optional(),

    distanceToSchool: z
        .string()
        .max(50)
        .optional(),

    transport: z
        .string()
        .max(50)
        .optional(),

    hobby: z
        .string()
        .max(100)
        .optional(),

    dream: z
        .string()
        .max(100)
        .optional(),

    closeFriend: z
        .string()
        .max(100)
        .optional()


})