//Files: src/modules/student-report/application/usecase/GetAttendanceStatisticUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { AttendanceStatisticDTO } from "@/modules/student-report/domain/dto";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET ATTENDANCE STATISTIC
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil statistik
 * kehadiran siswa.
 *
 * Statistik kehadiran meliputi:
 * - total kehadiran
 * - jumlah izin
 * - jumlah alpha
 * - jumlah sakit
 *
 * Alur proses:
 * 1. Mengambil data statistik kehadiran dari repository
 * 2. Memvalidasi jumlah kehadiran siswa
 * 3. Memastikan nilai statistik tidak bernilai negatif
 * 4. Memastikan total status tidak melebihi total kehadiran
 * 5. Mengembalikan statistik kehadiran
 *
 * @returns {Promise<AttendanceStatisticDTO>}
 * Mengembalikan statistik kehadiran siswa.
 *
 * @throws {AppError}
 * Jika statistik kehadiran tidak valid.
 *
 * @example
 * const statistic = await getAttendanceStatisticUseCase.execute()
 */

export class GetAttendanceStatisticUseCase extends BaseUseCase<void, AttendanceStatisticDTO> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(): Promise<AttendanceStatisticDTO> {
    const statistic = await this.repo.getAttendanceStatistic();

    if (!statistic) {
      throw new AppError("Attendance statistic unavailable");
    }

    if (statistic.totalAttendance < 0) {
      throw new AppError("Invalid total attendance count");
    }

    if (statistic.present + statistic.absent + statistic.late > statistic.totalAttendance) {
      throw new AppError("Attendance statistic integrity error");
    }

    return statistic;
  }
}
