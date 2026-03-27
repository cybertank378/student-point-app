//Files: src/modules/student-report/domain/ViolationHeatmap.ts
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * ViolationHeatmap Entity
 *
 * @module student-report
 * @layer domain
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Entity ini merepresentasikan heatmap pelanggaran
 * berdasarkan kelas.
 *
 * Digunakan untuk mengidentifikasi kelas dengan
 * tingkat pelanggaran tertinggi.
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
 * @returns {ViolationHeatmap}
 *
 * ============================================================
 * EXAMPLE
 * ============================================================
 *
 * const heatmap = new ViolationHeatmap(
 *   "7A",
 *   "Kelas 7A",
 *   12
 * )
 *
 */

export class ViolationHeatmap {
  constructor(
    public readonly classId: string,
    public readonly className: string,
    public readonly totalViolations: number
  ) {}
}
