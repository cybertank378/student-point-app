// Files: src/modules/student/application/usecases/CheckStudentNisnExistsUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * GET STUDENT BY NISN USE CASE
 * ============================================================
 *
 * Use case ini digunakan untuk mengambil data siswa
 * berdasarkan NISN (Nomor Induk Siswa Nasional).
 *
 * ------------------------------------------------------------
 * PARAMETER
 * ------------------------------------------------------------
 *
 * @param nisn nomor induk siswa nasional
 *
 * ------------------------------------------------------------
 * RETURN
 * ------------------------------------------------------------
 *
 * @returns entitas Student atau null jika tidak ditemukan
 */
export class CheckStudentNisnExistsUseCase extends BaseUseCase<string, boolean> {
  constructor(private readonly repository: StudentInterface) {
    super();
  }

  protected async handle(nisn: string): Promise<boolean> {
    return this.repository.existsByNISN(nisn);
  }
}
