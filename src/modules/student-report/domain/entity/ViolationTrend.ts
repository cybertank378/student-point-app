//Files: src/modules/student-report/domain/ViolationTrend.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * ViolationTrend Entity
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Entity ini merepresentasikan tren pelanggaran
 * siswa berdasarkan periode waktu (bulan).
 *
 * Digunakan untuk analisis tren kedisiplinan siswa
 * pada dashboard sekolah.
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
 * @returns {ViolationTrend}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const trend = new ViolationTrend(
 *   "2026-03",
 *   15
 * )
 *
 */

export class ViolationTrend {
  constructor(
    public readonly month: string,
    public readonly totalViolations: number
  ) {}
}
