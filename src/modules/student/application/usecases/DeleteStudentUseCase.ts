// src/modules/student/application/usecases/DeleteStudentUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import { STUDENT_ERRORS } from "@/modules/student/domain/constants/studentErrorMessages";
import type { DeleteStudentDTO } from "@/modules/student/domain/dto";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * DELETE STUDENT USE CASE
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk melakukan
 * penghapusan data siswa secara soft delete.
 *
 * Soft delete digunakan agar:
 *
 * - Riwayat siswa tetap dapat dilacak
 * - Data tidak hilang permanen dari database
 * - Sistem audit tetap berjalan
 *
 * ------------------------------------------------------------
 * TANGGUNG JAWAB
 * ------------------------------------------------------------
 *
 * - Memvalidasi Student ID
 * - Memastikan siswa ada
 * - Menghapus data melalui repository
 *
 * ------------------------------------------------------------
 * BUSINESS RULES
 * ------------------------------------------------------------
 *
 * - Student ID wajib diisi
 * - Data siswa harus ditemukan
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
 * DeleteStudentUseCase
 *      ↓
 * StudentRepository
 *      ↓
 * Prisma
 *
 * ------------------------------------------------------------
 * INPUT
 * ------------------------------------------------------------
 *
 * DeleteStudentDTO
 *
 * ------------------------------------------------------------
 * OUTPUT
 * ------------------------------------------------------------
 *
 * void
 *
 * ------------------------------------------------------------
 * ERROR YANG DAPAT DILEMPAR
 * ------------------------------------------------------------
 *
 * @throws AppError.validation
 * Jika Student ID tidak diisi
 *
 * @throws AppError.notFound
 * Jika siswa tidak ditemukan
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class DeleteStudentUseCase extends BaseUseCase<DeleteStudentDTO, void> {
  constructor(private readonly repository: StudentInterface) {
    super();
  }

  protected async handle(dto: DeleteStudentDTO): Promise<void> {
    if (!dto.id) {
      throw AppError.validation(STUDENT_ERRORS.STUDENT_ID_IS_REQUIRED);
    }

    const student = await this.repository.findById(dto.id);

    if (!student) {
      throw AppError.notFound(STUDENT_ERRORS.STUDENT_NOT_FOUND);
    }

    await this.repository.delete(dto);
  }
}
