//Files: src/modules/student-report/domain/StudentStatistic.ts

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * StudentStatistic Entity
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Entity ini merepresentasikan statistik dasar siswa
 * pada sistem manajemen sekolah.
 *
 * Digunakan oleh dashboard untuk mengetahui
 * jumlah total siswa dan status siswa.
 *
 * Prinsip desain:
 * - KISS
 * - SRP
 * - Single Source of Truth
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {number} totalStudents
 * @param {number} activeStudents
 * @param {number} graduatedStudents
 * @param {number} transferredStudents
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {StudentStatistic}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * new StudentStatistic(850,820,20,10)
 *
 */

export class StudentStatistic {
  constructor(
    public readonly totalStudents: number,
    public readonly activeStudents: number,
    public readonly graduatedStudents: number,
    public readonly transferredStudents: number
  ) {}
}
