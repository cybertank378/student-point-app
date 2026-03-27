//Files: src/modules/student-counseling/infrastructure/validators/base.student.counseling.validator.ts

import { z } from "zod"
import { CaseSource } from "@/libs/utils/enums"
import {UUID_REGEX} from "@/libs/utils";

/**
 * ============================================================
 * BASE STUDENT COUNSELING VALIDATOR
 * ============================================================
 *
 * Base schema untuk field domain yang digunakan
 * oleh seluruh validator Student Counseling.
 *
 * Tujuan
 * - Menghindari duplikasi rule
 * - Menjaga konsistensi validasi antar endpoint
 */

export const baseStudentCounselingValidator = {

    academicYearId: z
        .string()
        .regex(UUID_REGEX,"AcademicYearId harus berupa UUID"),

    reason: z
        .string()
        .min(1, "Reason tidak boleh kosong")
        .max(500, "Reason maksimal 500 karakter"),

    source: z
        .enum(CaseSource)

}