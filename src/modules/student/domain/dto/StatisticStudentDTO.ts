//Files: src/modules/student/domain/dto/StatisticStudentDTO.ts
//Files: src/modules/student/domain/dto/StatisticStudentDTO.ts

/**
 * ============================================================
 * STUDENT STATISTIC DTO
 * ============================================================
 *
 * DTO ini merepresentasikan statistik agregasi siswa
 * yang digunakan pada dashboard admin / monitoring.
 *
 * Statistik dihitung dari tabel:
 *
 * - Student
 * - StudentEnrollment
 * - StudentViolation
 *
 * Digunakan oleh:
 *
 * - Dashboard Admin
 * - Dashboard Monitoring
 *
 * Catatan:
 *
 * DTO ini hanya digunakan untuk operasi READ agregasi.
 */

export interface StudentStatisticDTO {
  /**
   * Total seluruh siswa aktif
   */
  totalStudents: number;

  /**
   * Total siswa kelas VII
   */
  totalGrade7: number;

  /**
   * Total siswa kelas VIII
   */
  totalGrade8: number;

  /**
   * Total siswa kelas IX
   */
  totalGrade9: number;

  /**
   * Statistik pelanggaran per bulan per grade
   *
   * Digunakan untuk bar chart ApexCharts
   */
  monthlyViolationByGrade: MonthlyViolationByGradeDTO[];

  /**
   * Trend total pelanggaran siswa per bulan
   *
   * Digunakan untuk line chart
   */
  violationTrend: ViolationTrendDTO[];
}

/**
 * Statistik pelanggaran per bulan per grade
 */

export interface MonthlyViolationByGradeDTO {
  /**
   * Nomor bulan (1-12)
   */
  month: number;

  /**
   * Label bulan
   * Contoh: Jan, Feb, Mar
   */
  monthLabel: string;

  /**
   * Total pelanggaran siswa kelas VII
   */
  grade7: number;

  /**
   * Total pelanggaran siswa kelas VIII
   */
  grade8: number;

  /**
   * Total pelanggaran siswa kelas IX
   */
  grade9: number;
}

/**
 * Trend total pelanggaran per bulan
 */

export interface ViolationTrendDTO {
  /**
   * Nomor bulan (1-12)
   */
  month: number;

  /**
   * Label bulan
   * Contoh: Jan, Feb, Mar
   */
  monthLabel: string;

  /**
   * Total pelanggaran dalam bulan tersebut
   */
  totalViolations: number;
}