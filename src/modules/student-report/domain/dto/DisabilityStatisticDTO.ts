//Files: src/modules/student-report/domain/dto/DisabilityStatisticDTO.ts
//Files: src/modules/student-report/domain/dto/DisabilityStatisticDTO.ts

/**
 * ============================================================
 * DISABILITY STATISTIC DTO
 * ============================================================
 *
 * @module student-report
 * @layer domain
 *
 * DTO ini merepresentasikan data statistik siswa difabel
 * yang digunakan dalam laporan atau dashboard sistem sekolah.
 *
 * Data ini biasanya digunakan untuk:
 * - Monitoring pendidikan inklusif
 * - Laporan statistik sekolah
 * - Dashboard analitik siswa
 *
 * @interface DisabilityStatisticDTO
 *
 * @property {number} difableStudents
 * Jumlah siswa yang memiliki disabilitas.
 *
 * @property {number} totalStudents
 * Jumlah seluruh siswa dalam sistem.
 *
 * @property {number} percentage
 * Persentase siswa difabel terhadap total siswa.
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const statistic: DisabilityStatisticDTO = {
 *   difableStudents: 2,
 *   totalStudents: 100,
 *   percentage: 2
 * };
 *
 */
export interface DisabilityStatisticDTO {
  difableStudents: number;
  totalStudents: number;
  percentage: number;
}
