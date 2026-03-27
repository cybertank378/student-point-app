//Files: src/modules/student-report/application/usecase/GetDisabilityStatisticUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { DisabilityStatisticDTO } from "@/modules/student-report/domain/dto";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET DISABILITY STATISTIC
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil statistik
 * siswa difabel.
 *
 * Alur proses:
 * 1. Mengambil statistik difabel dari repository
 * 2. Memvalidasi jumlah siswa difabel
 * 3. Memastikan jumlah difabel tidak melebihi total siswa
 * 4. Mengembalikan statistik difabel
 *
 * @returns {Promise<DisabilityStatisticDTO>}
 * Mengembalikan statistik difabel.
 *
 * @throws {AppError}
 * Jika statistik difabel tidak valid.
 *
 * @example
 * const stat = await getDisabilityStatisticUseCase.execute()
 */

export class GetDisabilityStatisticUseCase extends BaseUseCase<void, DisabilityStatisticDTO> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(): Promise<DisabilityStatisticDTO> {
    const statistic = await this.repo.getDisabilityStatistic();

    if (!statistic) {
      throw new AppError("Disability statistic unavailable");
    }

    if (statistic.difableStudents > statistic.totalStudents) {
      throw new AppError("Invalid disability statistic ratio");
    }

    return statistic;
  }
}
