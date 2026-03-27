//Files: src/modules/student-report/application/usecase/GetClassStatisticsUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { ClassStatisticDTO } from "@/modules/student-report/domain/dto";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET CLASS STATISTICS
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil statistik
 * jumlah siswa pada setiap kelas.
 *
 * Alur proses:
 * 1. Mengambil statistik kelas dari repository
 * 2. Memvalidasi identitas kelas
 * 3. Memastikan jumlah siswa tidak bernilai negatif
 * 4. Mengembalikan statistik kelas
 *
 * @returns {Promise<ClassStatisticDTO[]>}
 * Mengembalikan statistik siswa per kelas.
 *
 * @throws {AppError}
 * Jika data statistik kelas tidak valid.
 *
 * @example
 * const stats = await getClassStatisticsUseCase.execute()
 */

export class GetClassStatisticsUseCase extends BaseUseCase<void, ClassStatisticDTO[]> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(): Promise<ClassStatisticDTO[]> {
    const statistics = await this.repo.getClassStatistics();

    if (!statistics) {
      throw new AppError("Class statistics unavailable");
    }

    for (const stat of statistics) {
      if (!stat.classId) {
        throw new AppError("Invalid class statistic: missing class identifier");
      }

      if (stat.totalStudents < 0) {
        throw new AppError("Invalid student count for class");
      }
    }

    return statistics;
  }
}
