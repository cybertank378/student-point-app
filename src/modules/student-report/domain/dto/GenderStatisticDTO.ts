//Files: src/modules/student-report/domain/dto/GenderStatisticDTO.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * GenderStatisticDTO
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * DTO ini merepresentasikan distribusi siswa
 * berdasarkan jenis kelamin.
 *
 * Digunakan oleh dashboard untuk menampilkan
 * grafik distribusi gender siswa.
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
 * @returns {GenderStatisticDTO}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * {
 *   maleStudents: 420,
 *   femaleStudents: 400
 * }
 *
 */

export interface GenderStatisticDTO {
  maleStudents: number;
  femaleStudents: number;
}
