//Files: src/modules/student-composite/application/services/StudentCompositeService.ts
import { BaseAppServices } from "@/modules/shared/core/BaseAppServices";

import type { Result } from "@/modules/shared/core/Result";
import type { BasePaginationParams, BasePaginationResponse } from "@/modules/shared/http/pagination/BasePagination";
import { GetCompositeByIdUseCase } from "@/modules/student-composite/application/usecases/GetCompositeByIdUseCase";
import { GetStudentListCompositeUseCase } from "@/modules/student-composite/application/usecases/GetStudentListCompositeUseCase";
import { ListCompositeCollectionUseCase } from "@/modules/student-composite/application/usecases/ListCompositeCollectionUseCase";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import type { StudentListCompositeDTO } from "@/modules/student-composite/domain/dto/StudentListCompositeDTO";
import type { StudentCompositeInterface } from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface";
import type { StudentCollectionKey } from "@/modules/student-composite/domain/types/StudentCollectionKey";
import {StudentListParams} from "@/modules/student-composite/domain/types/StudentListParams";

/**
 * ============================================================
 * STUDENT COMPOSITE SERVICE
 * ============================================================
 *
 * Service ini merupakan **entry point Application Layer**
 * untuk modul StudentComposite.
 *
 * Service bertindak sebagai **orchestrator** yang
 * mengeksekusi berbagai use case yang berkaitan
 * dengan data komposit siswa.
 *
 * Modul StudentComposite berfungsi sebagai
 * **jembatan antara parent module (Student)**
 * dengan berbagai child modules seperti:
 *
 * - student-achievement
 * - student-violation
 * - student-aid
 * - student-attendance
 * - student-enrollment
 * - student-parent
 * - counseling-case
 *
 * ------------------------------------------------------------
 * TANGGUNG JAWAB
 * ------------------------------------------------------------
 *
 * - Mengeksekusi use case melalui BaseAppServices
 * - Menjaga konsistensi pola Result<T>
 * - Menjadi facade bagi controller
 *
 * ------------------------------------------------------------
 * PRINSIP DESAIN
 * ------------------------------------------------------------
 *
 * - Hexagonal Architecture
 * - SRP (Single Responsibility Principle)
 * - DRY
 * - KISS
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class StudentCompositeService extends BaseAppServices {
  private readonly getCompositeByIdUseCase: GetCompositeByIdUseCase;
  private readonly getStudentListCompositeUseCase: GetStudentListCompositeUseCase;
  private readonly listCompositeCollectionUseCase: ListCompositeCollectionUseCase<StudentCollectionKey>;
  constructor(repo: StudentCompositeInterface) {
    super();

    this.getCompositeByIdUseCase = new GetCompositeByIdUseCase(repo);

    this.getStudentListCompositeUseCase = new GetStudentListCompositeUseCase(repo);

    this.listCompositeCollectionUseCase = new ListCompositeCollectionUseCase(repo);
  }

  /**
   * ============================================================
   * GET STUDENT COMPOSITE PROFILE
   * ============================================================
   *
   * Mengambil **profil komposit lengkap siswa**
   * berdasarkan ID siswa.
   *
   * Data yang diambil meliputi:
   *
   * - Data inti siswa
   * - Profil siswa
   * - Fasilitas siswa
   * - Kemampuan kesehatan siswa
   * - Aktivitas keagamaan siswa
   * - Informasi keluarga siswa
   * - Bantuan siswa
   * - Prestasi siswa
   * - Kehadiran siswa
   * - Riwayat kelas siswa
   * - Orang tua siswa
   * - Pelanggaran siswa
   * - Kasus konseling
   * - Ringkasan poin disiplin
   *
   * Digunakan oleh:
   *
   * - Halaman detail siswa
   * - Dashboard konseling
   * - Monitoring siswa
   *
   * @param studentId ID unik siswa
   *
   * @returns Result<StudentCompositeDTO>
   */

  getStudentComposite = (studentId: string): Promise<Result<StudentCompositeDTO>> =>
    this.execute(this.getCompositeByIdUseCase, { studentId });

  /**
   * ============================================================
   * GET STUDENT LIST
   * ============================================================
   *
   * Mengambil daftar siswa dengan payload ringan
   * untuk kebutuhan pagination besar.
   *
   * Data yang diambil:
   *
   * - Informasi inti siswa
   * - Enrollment aktif
   * - Ringkasan poin disiplin
   *
   * Digunakan oleh:
   *
   * - StudentTable
   * - StudentSearch
   * - StudentExport
   * - Dashboard monitoring siswa
   *
   * @param params parameter pagination
   *
   * @returns Result<BasePaginationResponse<StudentListCompositeDTO>>
   */

  getStudentList = (
      params: StudentListParams
  ): Promise<Result<BasePaginationResponse<StudentListCompositeDTO>>> => {
    return this.execute(this.getStudentListCompositeUseCase, params);
  };

  /**
   * ============================================================
   * LIST STUDENT COLLECTION
   * ============================================================
   *
   * Mengambil koleksi data turunan siswa
   * berdasarkan jenis koleksi tertentu.
   *
   * Koleksi yang tersedia:
   *
   * - achievements
   * - violations
   * - attendances
   * - enrollments
   * - parents
   * - aids
   * - counselingCases
   * - point
   *
   * Contoh endpoint:
   *
   * GET /students/:id/achievements
   * GET /students/:id/violations
   * GET /students/:id/attendances
   *
   * @param studentId ID siswa
   * @param collection jenis koleksi
   * @param params parameter pagination
   *
   * @returns Result<BasePaginationResponse<T>>
   */

  listStudentCollection = <K extends StudentCollectionKey>(
    studentId: string,

    collection: K,

    params: BasePaginationParams
  ): Promise<Result<BasePaginationResponse<StudentCompositeDTO[K][number]>>> =>
    this.execute(this.listCompositeCollectionUseCase, {
      studentId,
      collection,
      params,
    });
}
