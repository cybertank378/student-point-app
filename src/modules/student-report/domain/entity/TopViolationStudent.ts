//Files: src/modules/student-report/domain/TopViolationStudent.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * TopViolationStudent Entity
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Entity ini merepresentasikan siswa dengan
 * jumlah poin pelanggaran tertinggi.
 *
 * Digunakan untuk menampilkan daftar siswa
 * dengan pelanggaran terbanyak pada dashboard.
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {string} studentId id siswa
 * @param {string} studentName nama siswa
 * @param {number} totalPoints total poin pelanggaran
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {TopViolationStudent}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const top = new TopViolationStudent(
 *   "STD001",
 *   "Ahmad",
 *   120
 * )
 *
 */

export class TopViolationStudent {
  constructor(
    public readonly studentId: string,
    public readonly studentName: string,
    public readonly totalPoints: number
  ) {}
}
