//Files: src/modules/student-aid/domain/dto/StudentAidDTO.ts

/**
 * ============================================================
 * STUDENT AID DTO
 * ============================================================
 *
 * Data transfer object used between
 * application and infrastructure layers.
 */

export interface StudentAidDTO {

    id: string

    studentId: string

    academicYearId: string

    kjp: boolean

    pip: boolean

}