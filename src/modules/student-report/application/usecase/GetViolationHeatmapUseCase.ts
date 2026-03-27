//Files: src/modules/student-report/application/usecase/GetViolationHeatmapUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import { AppError } from "@/modules/shared/errors/AppError";

import type { ViolationHeatmapDTO } from "@/modules/student-report/domain/dto";

import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET VIOLATION HEATMAP
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil heatmap
 * pelanggaran siswa berdasarkan kelas.
 *
 * Heatmap digunakan untuk melihat distribusi pelanggaran
 * siswa pada setiap kelas dalam sistem sekolah.
 *
 * Alur proses:
 * 1. Mengambil data heatmap pelanggaran dari repository
 * 2. Memvalidasi integritas data heatmap
 * 3. Memastikan jumlah pelanggaran tidak bernilai negatif
 * 4. Memastikan setiap heatmap memiliki identitas kelas
 * 5. Mengembalikan heatmap pelanggaran
 *
 * @returns {Promise<ViolationHeatmapDTO[]>}
 * Mengembalikan heatmap pelanggaran siswa.
 *
 * @throws {AppError}
 * Jika data heatmap pelanggaran tidak valid.
 *
 * @example
 * const heatmap =
 * await getViolationHeatmapUseCase.execute()
 */

export class GetViolationHeatmapUseCase extends BaseUseCase<void, ViolationHeatmapDTO[]> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(): Promise<ViolationHeatmapDTO[]> {
    const heatmap = await this.repo.getViolationHeatmap();

    if (!heatmap) {
      throw new AppError("Violation heatmap data unavailable");
    }

    for (const item of heatmap) {
      if (!item.classId) {
        throw new AppError("Invalid heatmap data: missing class identifier");
      }

      if (item.totalViolations < 0) {
        throw new AppError("Invalid heatmap violation count");
      }
    }

    return heatmap;
  }
}
