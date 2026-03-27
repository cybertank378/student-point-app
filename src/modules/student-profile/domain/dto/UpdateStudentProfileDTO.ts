//Files: src/modules/student-profile/domain/dto/UpdateStudentProfileDTO.ts
import type { CreateStudentProfileDTO } from "@/modules/student-profile/domain/dto/CreateStudentProfileDTO";

/**
 * DTO used for updating student profile data.
 *
 * Characteristics:
 * - Used in PATCH operations
 * - `studentId` is mandatory
 * - All other fields are optional
 *
 * This approach avoids duplication by reusing
 * `CreateStudentProfileDTO` fields.
 *
 * @dto UpdateStudentProfileDTO
 */


export type UpdateStudentProfileDTO =
    { studentId: string }
    & Partial<Omit<CreateStudentProfileDTO, "studentId">>