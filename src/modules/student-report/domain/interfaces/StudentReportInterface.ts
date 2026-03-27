//Files: src/modules/student-report/domain/interfaces/StudentReportInterface.ts
import type {
  AttendanceStatistic,
  ClassStatistic,
  CounselingStatistic,
  DisabilityStatistic,
  GenderStatistic,
  StudentStatistic,
  TopViolationStudent,
  ViolationHeatmap,
  ViolationStatistic,
  ViolationTrend,
} from "../entity";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * StudentReportRepository Interface
 *
 * @module student-report
 * @layer domain
 * @since 2026
 * @version 1.0.0
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Interface ini merupakan kontrak repository yang digunakan
 * untuk mengambil data analytics siswa dari sumber data.
 *
 * Repository ini digunakan oleh use case dashboard
 * untuk menghasilkan laporan statistik siswa.
 *
 * Repository ini bersifat:
 *
 * - Read Only
 * - Analytics Query
 * - Single Source of Truth untuk seluruh laporan siswa
 *
 * Implementasi repository biasanya berada pada layer:
 *
 * infrastructure/repositories
 *
 * Contoh implementasi:
 *
 * StudentReportRepositoryPrisma
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * tidak memiliki parameter
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * berbagai entity statistik siswa
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const stats = await repository.getStudentStatistic()
 *
 */

export interface StudentReportInterface {
  /**
   * Statistik siswa secara keseluruhan
   */
  getStudentStatistic(): Promise<StudentStatistic>;

  /**
   * Statistik siswa berdasarkan gender
   */
  getGenderStatistic(): Promise<GenderStatistic>;

  /**
   * Statistik jumlah siswa per kelas
   */
  getClassStatistics(): Promise<ClassStatistic[]>;

  /**
   * Statistik siswa difabel
   */
  getDisabilityStatistic(): Promise<DisabilityStatistic>;

  /**
   * Statistik pelanggaran siswa
   */
  getViolationStatistic(): Promise<ViolationStatistic>;

  /**
   * Statistik konseling siswa
   */
  getCounselingStatistic(): Promise<CounselingStatistic>;

  /**
   * Statistik kehadiran siswa
   */
  getAttendanceStatistic(): Promise<AttendanceStatistic>;

  /**
   * Top siswa dengan pelanggaran terbanyak
   */
  getTopViolationStudents(limit?: number): Promise<TopViolationStudent[]>;

  /**
   * Heatmap pelanggaran per kelas
   */
  getViolationHeatmap(): Promise<ViolationHeatmap[]>;

  /**
   * Tren pelanggaran siswa per bulan
   */
  getViolationTrend(): Promise<ViolationTrend[]>;
}
