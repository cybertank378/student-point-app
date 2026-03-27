//Files: src/modules/student-aid/domain/entity/StudentAid.ts

/**
 * ============================================================
 * STUDENT AID ENTITY
 * ============================================================
 *
 * Represents government financial assistance
 * received by a student within a specific academic year.
 */

export interface StudentAid {

    readonly id: string

    readonly studentId: string

    readonly academicYearId: string

    readonly kjp: boolean

    readonly pip: boolean

}