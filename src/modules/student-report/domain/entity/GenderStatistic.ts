//Files: src/modules/student-report/domain/GenderStatistic.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * GenderStatistic Entity
 *
 * @module student-report
 * @layer domain
 * @since 2026
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Entity ini merepresentasikan statistik distribusi
 * siswa berdasarkan jenis kelamin.
 *
 * Statistik ini biasanya digunakan untuk:
 *
 * - chart distribusi gender
 * - analisis demografi siswa
 *
 * Prinsip desain:
 *
 * - KISS
 * - SRP
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {number} maleStudents jumlah siswa laki-laki
 * @param {number} femaleStudents jumlah siswa perempuan
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {GenderStatistic}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const gender = new GenderStatistic(
 *   420,
 *   400
 * )
 *
 */

export class GenderStatistic {
  constructor(
    public readonly maleStudents: number,
    public readonly femaleStudents: number
  ) {}
}
