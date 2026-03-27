//Files: src/modules/student-counseling/infrastructure/validators/student.counseling.validator.ts

import { z } from "zod"

import {
    baseStudentCounselingValidator
} from "./base.student.counseling.validator"

/**
 * ============================================================
 * STUDENT COUNSELING VALIDATOR
 * ============================================================
 *
 * Schema validator untuk endpoint modul Student Counseling.
 *
 * Validator ini memanfaatkan base validator untuk
 * menjaga konsistensi rule domain.
 */

/**
 * ============================================================
 * OPEN CASE VALIDATOR
 * ============================================================
 */

export const openStudentCounselingValidator = z.object({

    academicYearId:
    baseStudentCounselingValidator.academicYearId,

    reason:
    baseStudentCounselingValidator.reason,

    source:
    baseStudentCounselingValidator.source

})

/**
 * ============================================================
 * UPDATE CASE VALIDATOR
 * ============================================================
 */

export const updateStudentCounselingValidator = z.object({

    reason:
        baseStudentCounselingValidator.reason.optional()

})

/**
 * ============================================================
 * CLOSE CASE VALIDATOR
 * ============================================================
 */

export const closeStudentCounselingValidator = z.object({

    caseId: z
        .string()
        .uuid("CaseId harus berupa UUID")

})