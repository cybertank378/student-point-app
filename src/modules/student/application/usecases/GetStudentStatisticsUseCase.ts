//Files: src/modules/student/application/usecases/GetStudentStatisticsUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import { STUDENT_ERRORS } from "@/modules/student/domain/constants/studentErrorMessages";
import type { StudentStatisticDTO } from "@/modules/student/domain/dto";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * GET STUDENT STATISTICS USE CASE
 * ============================================================
 *
 * Mengambil statistik dashboard siswa.
 *
 * Pattern:
 * BaseUseCase
 *
 * Layer:
 * Application
 */

export class GetStudentStatisticsUseCase extends BaseUseCase<void, StudentStatisticDTO> {
  constructor(private readonly repository: StudentInterface) {
    super();
  }

  /**
   * ============================================================
   * HANDLE USE CASE
   * ============================================================
   */

  protected async handle(): Promise<StudentStatisticDTO> {
    /**
     * ------------------------------------------------------------
     * STEP 1
     * Ambil statistik dari repository
     * ------------------------------------------------------------
     */

    const statistics = await this.repository.getStudentStatistics();

    /**
     * ------------------------------------------------------------
     * STEP 2
     * Guard: pastikan data tersedia
     * ------------------------------------------------------------
     */

    if (!statistics) {
      throw AppError.notFound(STUDENT_ERRORS.STUDENT_STATISTICS_NOT_FOUND);
    }

    /**
     * ------------------------------------------------------------
     * STEP 3
     * Validasi data statistik
     * ------------------------------------------------------------
     */

    this.validateStatistics(statistics);

    /**
     * ------------------------------------------------------------
     * STEP 4
     * Return hasil
     * ------------------------------------------------------------
     */

    return statistics;
  }

  /**
   * ============================================================
   * VALIDATE STATISTICS
   * ============================================================
   */

  private validateStatistics(data: StudentStatisticDTO): void {
    if (data.totalStudents < 0) {
      throw AppError.internal("Invalid student statistics data");
    }

    if (data.totalGrade7 < 0 || data.totalGrade8 < 0 || data.totalGrade9 < 0) {
      throw AppError.internal("Invalid grade distribution data");
    }

    if (!Array.isArray(data.monthlyViolationByGrade)) {
      throw AppError.internal("Invalid monthly violation by grade structure");
    }

    if (!Array.isArray(data.violationTrend)) {
      throw AppError.internal("Invalid violation trend structure");
    }
  }
}
