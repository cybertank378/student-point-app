// Files: src/modules/student-violation/infrastructure/validators/base.student.violation.validator.ts

import { z } from "zod"
import {UUID_REGEX} from "valibot";

/**
 * ============================================================
 * BASE STUDENT VIOLATION VALIDATORS
 * ============================================================
 *
 * Base reusable schemas for student violation validation.
 */

export const StudentViolationIdSchema =
    z.string().regex(UUID_REGEX)

export const StudentIdSchema =
    z.string().regex(UUID_REGEX)

export const ViolationIdSchema =
    z.string().regex(UUID_REGEX)

export const AcademicYearIdSchema =
    z.string().regex(UUID_REGEX)

export const HandlerTeacherIdSchema =
    z.string().regex(UUID_REGEX)

export const ViolationPointSchema =
    z.number().int().nonnegative()

export const OccurredAtSchema =
    z.coerce.date()

export const ResolutionNoteSchema =
    z.string().trim().nullable()

export const ViolationStatusSchema =
    z.enum([
        "OPEN",
        "IN_PROGRESS",
        "ESCALATED",
        "RESOLVED"
    ])

export const ViolationActionSchema =
    z.enum([
        "WARNING",
        "WRITTEN_NOTICE",
        "COUNSELING",
        "PARENT_CALL",
        "SUSPENSION"
    ])