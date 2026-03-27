//Files: src/modules/student-report/domain/dto/CounselingStatisticDTO.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * CounselingStatisticDTO
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * DTO ini merepresentasikan statistik konseling siswa
 * pada sistem bimbingan konseling sekolah.
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {number} totalSessions jumlah sesi konseling
 * @param {number} resolvedCases jumlah kasus selesai
 * @param {number} ongoingCases jumlah kasus berjalan
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {CounselingStatisticDTO}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * {
 *   totalSessions: 60,
 *   resolvedCases: 40,
 *   ongoingCases: 20
 * }
 *
 */

export interface CounselingStatisticDTO {
  totalSessions: number;
  resolvedCases: number;
  ongoingCases: number;
}
