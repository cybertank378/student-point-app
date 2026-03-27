//Files: src/modules/student-profile/domain/dto/CreateStudentProfileDTO.ts
/**
 * Data Transfer Object used when creating a student profile.
 *
 * This DTO represents the payload expected from external layers
 * (HTTP controller, service layer, etc.).
 *
 * @dto CreateStudentProfileDTO
 */

export interface CreateStudentProfileDTO {

    studentId: string

    childOrder?: number
    totalSiblings?: number

    distanceToSchool?: string
    transport?: string

    hobby?: string
    dream?: string
    closeFriend?: string

}