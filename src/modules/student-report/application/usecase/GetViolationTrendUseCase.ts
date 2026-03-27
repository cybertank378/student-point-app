//Files: src/modules/student-report/application/usecase/GetViolationTrendUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import { AppError } from "@/modules/shared/errors/AppError";

import type { ViolationTrendDTO } from "@/modules/student-report/domain/dto";

import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET VIOLATION TREND
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil trend
 * pelanggaran siswa berdasarkan periode waktu (per bulan).
 *
 * Trend pelanggaran digunakan untuk:
 * - menganalisis peningkatan pelanggaran
 * - mengidentifikasi periode rawan pelanggaran
 * - membantu pengambilan keputusan disiplin sekolah
 *
 * Alur proses:
 * 1. Mengambil data trend pelanggaran dari repository
 * 2. Memvalidasi integritas data trend
 * 3. Memastikan jumlah pelanggaran tidak bernilai negatif
 * 4. Memastikan setiap trend memiliki periode bulan
 * 5. Mengembalikan trend pelanggaran
 *
 * @returns {Promise<ViolationTrendDTO[]>}
 * Mengembalikan trend pelanggaran siswa per bulan.
 *
 * @throws {AppError}
 * Jika data trend pelanggaran tidak valid.
 *
 * @example
 * const trend =
 * await getViolationTrendUseCase.execute()
 */

export class GetViolationTrendUseCase extends BaseUseCase<void, ViolationTrendDTO[]> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(): Promise<ViolationTrendDTO[]> {
    const trend = await this.repo.getViolationTrend();

    if (!trend) {
      throw new AppError("Violation trend data unavailable");
    }

    for (const item of trend) {
      if (!item.month) {
        throw new AppError("Invalid violation trend: missing month identifier");
      }

      if (item.totalViolations < 0) {
        throw new AppError("Invalid violation trend count");
      }
    }

    return trend;
  }
}
