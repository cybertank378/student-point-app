// Files: src/modules/student-violation/infrastructure/validators/studentViolation.validator.ts

import { z } from "zod"

import {
    StudentViolationIdSchema,
    StudentIdSchema,
    ViolationIdSchema,
    AcademicYearIdSchema,
    HandlerTeacherIdSchema,
    ViolationPointSchema,
    OccurredAtSchema,
    ResolutionNoteSchema,
    ViolationStatusSchema,
    ViolationActionSchema
} from "@/modules/student-violation/infrastructure/validators/base.student.violation.validator"

/**
 * ============================================================
 * STUDENT VIOLATION VALIDATORS
 * ============================================================
 *
 * Request validation schemas used by HTTP controllers.
 */

export const RecordViolationSchema =
    z.object({

        studentId: StudentIdSchema,

        violationId: ViolationIdSchema,

        academicYearId: AcademicYearIdSchema,

        point: ViolationPointSchema,

        occurredAt: OccurredAtSchema

    })

export const ResolveViolationSchema =
    z.object({

        violationId: StudentViolationIdSchema,

        handlerTeacherId: HandlerTeacherIdSchema,

        status: ViolationStatusSchema,

        action: ViolationActionSchema,

        note: ResolutionNoteSchema

    })