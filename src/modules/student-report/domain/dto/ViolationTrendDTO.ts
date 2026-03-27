//Files: src/modules/student-report/domain/dto/ViolationTrendDTO.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * ViolationTrendDTO
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * DTO ini merepresentasikan tren pelanggaran siswa
 * berdasarkan periode waktu.
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {string} month bulan laporan
 * @param {number} totalViolations jumlah pelanggaran
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {ViolationTrendDTO}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * {
 *   month: "2026-03",
 *   totalViolations: 15
 * }
 *
 */

export interface ViolationTrendDTO {
  month: string;
  totalViolations: number;
}
