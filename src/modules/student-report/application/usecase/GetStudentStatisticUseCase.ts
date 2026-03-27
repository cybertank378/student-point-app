//Files: src/modules/student-report/application/usecase/GetStudentStatisticUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { StudentStatisticDTO } from "@/modules/student-report/domain/dto";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET STUDENT STATISTIC
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil statistik
 * dasar siswa dalam sistem sekolah.
 *
 * Alur proses:
 * 1. Mengambil data statistik siswa dari repository
 * 2. Memvalidasi integritas statistik siswa
 * 3. Memastikan nilai statistik tidak bernilai negatif
 * 4. Mengembalikan hasil statistik
 *
 * @returns {Promise<StudentStatisticDTO>}
 * Mengembalikan statistik siswa.
 *
 * @throws {AppError}
 * Jika statistik siswa tidak tersedia atau tidak valid.
 *
 * @example
 * const statistic = await getStudentStatisticUseCase.execute()
 */

export class GetStudentStatisticUseCase extends BaseUseCase<void, StudentStatisticDTO> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(): Promise<StudentStatisticDTO> {
    const statistic = await this.repo.getStudentStatistic();

    if (!statistic) {
      throw new AppError("Student statistic data unavailable");
    }

    if (statistic.totalStudents < 0) {
      throw new AppError("Invalid total student count");
    }

    if (statistic.activeStudents > statistic.totalStudents) {
      throw new AppError("Active student count exceeds total students");
    }

    return statistic;
  }
}
