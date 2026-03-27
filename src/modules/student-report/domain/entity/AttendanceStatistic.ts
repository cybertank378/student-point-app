//Files: src/modules/student-report/domain/AttendanceStatistic.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * AttendanceStatistic Entity
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Entity ini merepresentasikan statistik kehadiran
 * siswa pada sekolah.
 *
 * Digunakan untuk monitoring kehadiran siswa
 * dan analisis kedisiplinan.
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {number} totalAttendance total catatan kehadiran
 * @param {number} present jumlah hadir
 * @param {number} absent jumlah tidak hadir
 * @param {number} late jumlah terlambat
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {AttendanceStatistic}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const attendance = new AttendanceStatistic(
 *   2000,
 *   1800,
 *   150,
 *   50
 * )
 *
 */

export class AttendanceStatistic {
  constructor(
    public readonly totalAttendance: number,
    public readonly present: number,
    public readonly absent: number,
    public readonly late: number
  ) {}
}
