//Files: src/modules/student-report/domain/ClassStatistic.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * ClassStatistic Entity
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Entity ini merepresentasikan statistik jumlah siswa
 * pada setiap kelas.
 *
 * Digunakan oleh dashboard untuk menampilkan
 * distribusi siswa berdasarkan kelas.
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {string} classId id kelas
 * @param {string} className nama kelas
 * @param {number} totalStudents jumlah siswa pada kelas
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {ClassStatistic}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const stat = new ClassStatistic(
 *   "7A",
 *   "Kelas 7A",
 *   32
 * )
 *
 */

export class ClassStatistic {
  constructor(
    public readonly classId: string,
    public readonly className: string,
    public readonly totalStudents: number
  ) {}
}
