//Files: src/modules/student-report/domain/dto/TopViolationStudentDTO.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * TopViolationStudentDTO
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * DTO ini merepresentasikan siswa dengan jumlah
 * pelanggaran tertinggi.
 *
 * Digunakan untuk menampilkan daftar siswa dengan
 * pelanggaran terbanyak pada dashboard.
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
 * @returns {TopViolationStudentDTO}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * {
 *   studentId: "STD001",
 *   studentName: "Ahmad",
 *   totalPoints: 120
 * }
 *
 */

export interface TopViolationStudentDTO {
  studentId: string;
  studentName: string;
  totalPoints: number;
}
