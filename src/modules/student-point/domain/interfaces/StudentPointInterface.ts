//Files: src/modules/student-point/domain/interfaces/StudentPointInterface.ts

import {StudentPoint} from "@/modules/student-point/domain/entity/StudentPoint";

/**
 * ============================================================
 * STUDENT POINT INTERFACE
 * ============================================================
 *
 * Domain repository contract untuk modul Student Point.
 *
 * Interface ini bertindak sebagai Port pada arsitektur
 * Hexagonal yang digunakan oleh application layer
 * dan StudentComposite.
 *
 * Implementation dari interface ini berada pada
 * infrastructure layer (StudentPointRepository).
 *
 * Responsibilities:
 *
 * - Mengambil ringkasan poin siswa
 * - Membuat summary awal ketika student dibuat
 * - Menyimpan perubahan summary
 * - Mengambil daftar summary untuk ranking siswa
 */

export interface StudentPointInterface {

    findByStudentAndAcademicYear(
        studentId: string,
        academicYearId: string
    ): Promise<StudentPoint | null>

    listByAcademicYear(
        academicYearId: string
    ): Promise<StudentPoint[]>

    save(
        entity: StudentPoint
    ): Promise<StudentPoint>

}