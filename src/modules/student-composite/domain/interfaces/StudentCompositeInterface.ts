//Files: src/modules/student-composite/domain/interfaces/StudentCompositeInterface.ts
import type {
    StudentCompositeDTO
} from "@/modules/student-composite/domain/dto/StudentCompositeDTO"

import type {
    StudentListCompositeDTO
} from "@/modules/student-composite/domain/dto/StudentListCompositeDTO"

import type {
    StudentCollectionKey
} from "@/modules/student-composite/domain/types/StudentCollectionKey"

import type {
    BasePaginationParams,
    BasePaginationResponse
} from "@/modules/shared/http/pagination/BasePagination"
import {StudentListParams} from "@/modules/student-composite/domain/types/StudentListParams";

/**
 * ============================================================
 * STUDENT COMPOSITE INTERFACE
 * ============================================================
 *
 * Interface ini merupakan kontrak untuk operasi
 * pengambilan data komposit siswa.
 *
 * Modul StudentComposite berperan sebagai
 * aggregator antara parent module (Student)
 * dan berbagai child modules.
 *
 * Interface ini mendefinisikan operasi READ
 * tanpa mengetahui implementasi database.
 *
 * Implementasi akan berada pada layer:
 *
 * infrastructure/repositories
 *
 * Prinsip desain:
 *
 * - Hexagonal Architecture
 * - Dependency Inversion
 * - SRP
 *
 * Layer:
 *
 * Domain Layer
 */

export interface StudentCompositeInterface {

    /**
     * ============================================================
     * FIND STUDENT COMPOSITE BY ID
     * ============================================================
     *
     * Mengambil seluruh data komposit siswa
     * berdasarkan ID siswa.
     *
     * Digunakan oleh:
     *
     * - Student Detail Page
     * - Counseling Dashboard
     * - Monitoring Siswa
     */

    findById(
        studentId: string
    ): Promise<StudentCompositeDTO | null>


    /**
     * ============================================================
     * FIND STUDENT LIST
     * ============================================================
     *
     * Mengambil daftar siswa dengan payload ringan
     * untuk kebutuhan pagination besar.
     *
     * Digunakan oleh:
     *
     * - Student Table
     * - Student Search
     * - Student Export
     */

    findStudentList(
        params: StudentListParams
    ): Promise<
        BasePaginationResponse<StudentListCompositeDTO>
    >


    /**
     * ============================================================
     * LIST STUDENT COLLECTION
     * ============================================================
     *
     * Mengambil koleksi data child module siswa
     * secara dinamis.
     *
     * Contoh koleksi:
     *
     * - achievements
     * - violations
     * - attendances
     * - parents
     * - enrollments
     * - counselingCases
     */

    listStudentCollection<
        K extends StudentCollectionKey
    >(
        studentId: string,
        collection: K,
        params: BasePaginationParams
    ): Promise<
        BasePaginationResponse<
            StudentCompositeDTO[K][number]
        >
    >

}