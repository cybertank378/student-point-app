//Files: src/modules/student-report/domain/dto/ViolationHeatmapDTO.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * ViolationHeatmapDTO
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * DTO ini merepresentasikan heatmap pelanggaran
 * berdasarkan kelas.
 *
 * ============================================================
 * PARAM
 * ============================================================
 *
 * @param {string} classId id kelas
 * @param {string} className nama kelas
 * @param {number} totalViolations jumlah pelanggaran
 *
 * ============================================================
 * RETURNS
 * ============================================================
 *
 * @returns {ViolationHeatmapDTO}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * {
 *   classId: "7A",
 *   className: "Kelas 7A",
 *   totalViolations: 12
 * }
 *
 */

export interface ViolationHeatmapDTO {
  classId: string;
  className: string;
  totalViolations: number;
}
