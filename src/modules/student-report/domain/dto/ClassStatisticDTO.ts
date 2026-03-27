//Files: src/modules/student-report/domain/dto/ClassStatisticDTO.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * ClassStatisticDTO
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * DTO ini merepresentasikan statistik jumlah siswa
 * berdasarkan kelas.
 *
 * Digunakan untuk visualisasi distribusi siswa
 * per kelas pada dashboard sekolah.
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {string} classId id kelas
 * @param {string} className nama kelas
 * @param {number} totalStudents jumlah siswa dalam kelas
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {ClassStatisticDTO}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * {
 *   classId: "7A",
 *   className: "Kelas 7A",
 *   totalStudents: 32
 * }
 *
 */

export interface ClassStatisticDTO {
  classId: string;
  className: string;
  totalStudents: number;
}
