// Files: src/modules/student-point/domain/dto/StudentPointDTO.ts

/**
 * ============================================================
 * STUDENT POINT DTO
 * ============================================================
 *
 * DTO untuk transfer data antar layer.
 */

export interface StudentPointDTO {

    id: string

    studentId: string
    academicYearId: string

    totalViolationPoint: number
    totalAchievementPoint: number
    totalPoint: number

    updatedAt?: Date

}