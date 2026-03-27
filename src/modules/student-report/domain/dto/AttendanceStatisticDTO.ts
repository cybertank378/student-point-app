//Files: src/modules/student-report/domain/dto/AttendanceStatisticDTO.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * AttendanceStatisticDTO
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * DTO ini merepresentasikan statistik kehadiran siswa.
 *
 * Digunakan untuk analisis kedisiplinan siswa
 * berdasarkan kehadiran.
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
 * @returns {AttendanceStatisticDTO}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * {
 *   totalAttendance: 2000,
 *   present: 1800,
 *   absent: 150,
 *   late: 50
 * }
 *
 */

export interface AttendanceStatisticDTO {
  totalAttendance: number;
  present: number;
  absent: number;
  late: number;
}
