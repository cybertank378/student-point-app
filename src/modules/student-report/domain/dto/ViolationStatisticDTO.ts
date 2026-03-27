//Files: src/modules/student-report/domain/dto/ViolationStatisticDTO.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * ViolationStatisticDTO
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * DTO ini merepresentasikan statistik pelanggaran siswa.
 *
 * Digunakan untuk memonitor tingkat kedisiplinan siswa
 * pada dashboard sekolah.
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {number} totalViolations jumlah pelanggaran
 * @param {number} totalPoints total poin pelanggaran
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {ViolationStatisticDTO}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * {
 *   totalViolations: 120,
 *   totalPoints: 540
 * }
 *
 */

export interface ViolationStatisticDTO {
  totalViolations: number;
  totalPoints: number;
}
