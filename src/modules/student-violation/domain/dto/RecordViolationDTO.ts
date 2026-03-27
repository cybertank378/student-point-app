// Files: src/modules/student-violation/domain/dto/RecordViolationDTO.ts

/**
 * ============================================================
 * RECORD VIOLATION DTO
 * ============================================================
 *
 * Input structure used to record a new violation
 * committed by a student.
 */
export interface RecordViolationDTO {

    studentId: string

    violationId: string

    academicYearId: string

    point: number

    occurredAt: Date

}