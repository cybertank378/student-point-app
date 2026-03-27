//Files: src/modules/student-profile/domain/dto/StudentProfileDTO.ts
/**
 * Data Transfer Object (DTO) for representing a student's profile details.
 */
export interface StudentProfileDTO {

    id: string
    studentId: string

    childOrder: number | null
    totalSiblings: number | null

    distanceToSchool: string | null
    transport: string | null

    hobby: string | null
    dream: string | null
    closeFriend: string | null

}