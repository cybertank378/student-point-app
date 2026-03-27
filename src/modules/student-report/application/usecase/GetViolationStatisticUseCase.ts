//Files: src/modules/student-report/application/usecase/GetViolationStatisticUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { ViolationStatisticDTO } from "@/modules/student-report/domain/dto";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET VIOLATION STATISTIC
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil statistik
 * pelanggaran siswa.
 *
 * Alur proses:
 * 1. Mengambil statistik pelanggaran dari repository
 * 2. Memvalidasi jumlah pelanggaran
 * 3. Memastikan total poin pelanggaran valid
 * 4. Mengembalikan statistik pelanggaran
 *
 * @returns {Promise<ViolationStatisticDTO>}
 *
 * @throws {AppError}
 *
 * @example
 * const stat = await getViolationStatisticUseCase.execute()
 */

export class GetViolationStatisticUseCase extends BaseUseCase<void, ViolationStatisticDTO> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(): Promise<ViolationStatisticDTO> {
    const statistic = await this.repo.getViolationStatistic();

    if (!statistic) {
      throw new AppError("Violation statistic unavailable");
    }

    if (statistic.totalViolations < 0) {
      throw new AppError("Invalid violation count");
    }

    return statistic;
  }
}
