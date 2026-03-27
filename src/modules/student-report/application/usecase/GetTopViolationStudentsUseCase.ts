//Files: src/modules/student-report/application/usecase/GetTopViolationStudentsUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { TopViolationStudentDTO } from "@/modules/student-report/domain/dto";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * USE CASE: GET TOP VIOLATION STUDENTS
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil daftar
 * siswa dengan jumlah poin pelanggaran tertinggi.
 *
 * Alur proses:
 * 1. Memvalidasi parameter limit
 * 2. Mengambil daftar siswa dengan poin pelanggaran tertinggi
 * 3. Memvalidasi integritas poin pelanggaran siswa
 * 4. Mengembalikan daftar siswa pelanggaran tertinggi
 *
 * @param {number} limit
 * Jumlah maksimum siswa yang diambil.
 *
 * @returns {Promise<TopViolationStudentDTO[]>}
 * Mengembalikan daftar siswa dengan pelanggaran tertinggi.
 *
 * @throws {AppError}
 * Jika limit tidak valid atau data pelanggaran tidak valid.
 *
 * @example
 * const students =
 * await getTopViolationStudentsUseCase.execute(10)
 */

export class GetTopViolationStudentsUseCase extends BaseUseCase<number, TopViolationStudentDTO[]> {
  constructor(private readonly repo: StudentReportInterface) {
    super();
  }

  protected async handle(limit: number): Promise<TopViolationStudentDTO[]> {
    if (!limit) {
      throw new AppError("Limit parameter is required");
    }

    if (limit <= 0) {
      throw new AppError("Limit must be greater than zero");
    }

    if (limit > 100) {
      throw new AppError("Limit exceeds allowed maximum");
    }

    const students = await this.repo.getTopViolationStudents(limit);

    for (const student of students) {
      if (student.totalPoints < 0) {
        throw new AppError("Violation point integrity error");
      }
    }

    return students;
  }
}
