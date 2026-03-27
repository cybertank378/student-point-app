//Files: src/modules/student/application/usecases/ImportStudentUseCase.ts
// src/modules/student/application/usecases/ImportStudentUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import { STUDENT_ERRORS } from "@/modules/student/domain/constants/studentErrorMessages";
import type { BulkImportStudentDTO } from "@/modules/student/domain/dto";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * IMPORT STUDENT USE CASE
 * ============================================================
 *
 * Use case ini menangani proses import data siswa
 * secara massal dari file Excel atau CSV.
 *
 * Proses ini digunakan untuk:
 *
 * - Migrasi data siswa lama
 * - Import siswa baru dari sistem eksternal
 * - Sinkronisasi data sekolah
 *
 * ------------------------------------------------------------
 * TANGGUNG JAWAB
 * ------------------------------------------------------------
 *
 * - Memvalidasi data import
 * - Memastikan data tidak kosong
 * - Mengirim data ke repository untuk diproses
 *
 * ------------------------------------------------------------
 * BUSINESS RULES
 * ------------------------------------------------------------
 *
 * - Data import tidak boleh kosong
 *
 * ------------------------------------------------------------
 * DEPENDENCY
 * ------------------------------------------------------------
 *
 * StudentInterface (Repository Port)
 *
 * ------------------------------------------------------------
 * FLOW EKSEKUSI
 * ------------------------------------------------------------
 *
 * HTTP Request
 *      ↓
 * StudentController
 *      ↓
 * StudentApplicationService
 *      ↓
 * ImportStudentUseCase
 *      ↓
 * StudentRepository.bulkImportCreate()
 *      ↓
 * Prisma Transaction
 *
 * ------------------------------------------------------------
 * INPUT
 * ------------------------------------------------------------
 *
 * BulkImportStudentDTO[]
 *
 * ------------------------------------------------------------
 * OUTPUT
 * ------------------------------------------------------------
 *
 * number
 *
 * jumlah siswa yang berhasil diimport
 *
 * ------------------------------------------------------------
 * ERROR YANG DAPAT DILEMPAR
 * ------------------------------------------------------------
 *
 * @throws AppError.validation
 * Jika data import kosong
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class ImportStudentUseCase extends BaseUseCase<BulkImportStudentDTO[], number> {
  constructor(private readonly repository: StudentInterface) {
    super();
  }

  protected async handle(data: BulkImportStudentDTO[]): Promise<number> {
    if (!data.length) {
      throw AppError.validation(STUDENT_ERRORS.IMPORT_DATA_EMPTY);
    }

    return this.repository.bulkImportCreate(data);
  }
}
