//Files: src/modules/student-report/application/usecase/GetGenderStatisticUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { GenderStatisticDTO } from "@/modules/student-report/domain/dto";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET GENDER STATISTIC
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil statistik
 * distribusi gender siswa.
 *
 * Alur proses:
 * 1. Mengambil statistik gender dari repository
 * 2. Memvalidasi jumlah siswa laki-laki dan perempuan
 * 3. Mengembalikan statistik gender
 *
 * @returns {Promise<GenderStatisticDTO>}
 * Mengembalikan statistik gender siswa.
 *
 * @throws {AppError}
 * Jika statistik gender tidak valid.
 *
 * @example
 * const statistic = await getGenderStatisticUseCase.execute()
 */

export class GetGenderStatisticUseCase extends BaseUseCase<void, GenderStatisticDTO> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(): Promise<GenderStatisticDTO> {
    const statistic = await this.repo.getGenderStatistic();

    if (!statistic) {
      throw new AppError("Gender statistic unavailable");
    }

    if (statistic.maleStudents < 0 || statistic.femaleStudents < 0) {
      throw new AppError("Invalid gender statistic values");
    }

    return statistic;
  }
}
