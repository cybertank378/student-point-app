//Files: src/modules/student-aid/infrastructure/validator/base.studentaid.validator.ts
import { z } from "zod";
import {UUID_REGEX} from "valibot";

/**
 * ============================================================
 * BASE STUDENT AID VALIDATOR
 * ============================================================
 *
 * Reusable validation rules for StudentAid domain.
 * These rules act as a single source of truth for field validation.
 */

export const BaseStudentAidValidator = {

    id: z
        .string()
        .regex(UUID_REGEX),

    studentId: z
        .string()
        .regex(UUID_REGEX),

    academicYearId: z
        .string()
        .regex(UUID_REGEX),

    kjp: z
        .boolean(),

    pip: z
        .boolean()

};