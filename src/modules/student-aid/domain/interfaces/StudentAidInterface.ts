//Files: src/modules/student-aid/domain/interfaces/StudentAidInterface.ts
import type { StudentAidDTO } from "@/modules/student-aid/domain/dto/StudentAidDTO"

/**
 * ============================================================
 * STUDENT AID REPOSITORY PORT
 * ============================================================
 *
 * Defines persistence operations for student aid records.
 */

export interface StudentAidInterface {

    /**
     * Execute operations inside database transaction.
     */
    withTransaction<T>(
        callback: () => Promise<T>
    ): Promise<T>

    /**
     * Assign aid for a student in academic year.
     */
    assign(
        data: Omit<StudentAidDTO, "id">
    ): Promise<StudentAidDTO>

    /**
     * Update existing aid record.
     */
    update(
        data: StudentAidDTO
    ): Promise<StudentAidDTO>

    /**
     * Retrieve aids belonging to a student.
     */
    findByStudent(
        studentId: string
    ): Promise<StudentAidDTO[]>

    /**
     * Find aid record for academic year.
     */
    findByStudentAndYear(
        studentId: string,
        academicYearId: string
    ): Promise<StudentAidDTO | null>

}
