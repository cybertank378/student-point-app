//Files: src/modules/student-report/application/usecase/GetCounselingStatisticUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { CounselingStatisticDTO } from "@/modules/student-report/domain/dto";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET COUNSELING STATISTIC
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil statistik
 * konseling siswa dalam sistem sekolah.
 *
 * Statistik konseling meliputi:
 * - total sesi konseling
 * - jumlah kasus yang telah diselesaikan
 * - jumlah kasus yang sedang berjalan
 *
 * Alur proses:
 * 1. Mengambil data statistik konseling dari repository
 * 2. Memvalidasi integritas jumlah sesi konseling
 * 3. Memastikan jumlah kasus terselesaikan tidak melebihi total sesi
 * 4. Memastikan jumlah kasus berjalan tidak melebihi total sesi
 * 5. Mengembalikan statistik konseling
 *
 * @returns {Promise<CounselingStatisticDTO>}
 * Mengembalikan statistik konseling siswa.
 *
 * @throws {AppError}
 * Jika statistik konseling tidak valid.
 *
 * @example
 * const statistic = await getCounselingStatisticUseCase.execute()
 */

export class GetCounselingStatisticUseCase extends BaseUseCase<void, CounselingStatisticDTO> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(): Promise<CounselingStatisticDTO> {
    const statistic = await this.repo.getCounselingStatistic();

    if (!statistic) {
      throw new AppError("Counseling statistic unavailable");
    }

    if (statistic.totalSessions < 0) {
      throw new AppError("Invalid counseling session count");
    }

    if (statistic.resolvedCases > statistic.totalSessions) {
      throw new AppError("Resolved counseling cases exceed total sessions");
    }

    if (statistic.ongoingCases > statistic.totalSessions) {
      throw new AppError("Ongoing counseling cases exceed total sessions");
    }

    return statistic;
  }
}
