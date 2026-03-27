//Files: src/modules/student-report/domain/dto/StudentStatisticDTO.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * StudentStatisticDTO
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
 * DTO ini merepresentasikan statistik umum siswa
 * pada dashboard sekolah.
 *
 * DTO ini digunakan untuk mentransfer data statistik
 * dari domain ke application layer.
 *
 * Prinsip desain:
 *
 * - KISS
 * - DRY
 * - SRP
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {number} totalStudents jumlah seluruh siswa
 * @param {number} activeStudents jumlah siswa aktif
 * @param {number} graduatedStudents jumlah siswa lulus
 * @param {number} transferredStudents jumlah siswa pindah
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {StudentStatisticDTO}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * {
 *   totalStudents: 850,
 *   activeStudents: 820,
 *   graduatedStudents: 20,
 *   transferredStudents: 10
 * }
 *
 */

export interface StudentStatisticDTO {
  totalStudents: number;
  activeStudents: number;
  graduatedStudents: number;
  transferredStudents: number;
}
