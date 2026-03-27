//Files: src/modules/student-profile/domain/interfaces/StudentProfileInterface.ts

import { StudentProfile } from "@/modules/student-profile/domain/entity/StudentProfile"
import {CreateStudentProfileDTO} from "@/modules/student-profile/domain/dto/CreateStudentProfileDTO";
import {UpdateStudentProfileDTO} from "@/modules/student-profile/domain/dto/UpdateStudentProfileDTO";
import {StudentProfileDTO} from "@/modules/student-profile/domain/dto/StudentProfileDTO";


/**
 * Contract defining persistence operations for StudentProfile.
 *
 * This interface acts as a **domain port** in Hexagonal Architecture.
 * Infrastructure layers must implement this contract.
 *
 * Responsibilities:
 * - Retrieve student profile data
 * - Persist new profile records
 * - Update existing profile records
 *
 * @interface StudentProfileInterface
 */
export interface StudentProfileInterface {


    /**
     * Execute operations inside database transaction.
     */
    withTransaction<T>(
        callback: () => Promise<T>
    ): Promise<T>

    create(data: CreateStudentProfileDTO): Promise<StudentProfileDTO>

    update(data: UpdateStudentProfileDTO): Promise<StudentProfileDTO>

    findByStudentId(studentId: string): Promise<StudentProfileDTO | null>

    delete(studentId: string): Promise<void>

}