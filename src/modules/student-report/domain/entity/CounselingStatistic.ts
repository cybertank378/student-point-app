//Files: src/modules/student-report/domain/CounselingStatistic.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * CounselingStatistic Entity
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Entity ini merepresentasikan statistik kegiatan
 * konseling siswa.
 *
 * Digunakan oleh guru BK untuk memantau jumlah kasus
 * dan status penyelesaian konseling.
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
 * @returns {CounselingStatistic}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const counseling = new CounselingStatistic(
 *   60,
 *   40,
 *   20
 * )
 *
 */

export class CounselingStatistic {
  constructor(
    public readonly totalSessions: number,
    public readonly resolvedCases: number,
    public readonly ongoingCases: number
  ) {}
}
