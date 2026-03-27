//Files: src/modules/student-report/domain/ViolationStatistic.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * ViolationStatistic Entity
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Entity ini merepresentasikan statistik pelanggaran
 * siswa pada sekolah.
 *
 * Statistik ini digunakan untuk monitoring tingkat
 * kedisiplinan siswa.
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
 * @returns {ViolationStatistic}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const violation = new ViolationStatistic(
 *   120,
 *   540
 * )
 *
 */

export class ViolationStatistic {
  constructor(
    public readonly totalViolations: number,
    public readonly totalPoints: number
  ) {}
}
