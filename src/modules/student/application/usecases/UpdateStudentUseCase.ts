// Files: src/modules/student/application/usecases/UpdateStudentUseCase.ts
// src/modules/student/application/usecases/UpdateStudentUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import { STUDENT_ERRORS } from "@/modules/student/domain/constants/studentErrorMessages";
import type { StudentIdentityDTO, UpdateStudentDTO } from "@/modules/student/domain/dto";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * UPDATE STUDENT USE CASE
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk memperbarui
 * data identitas siswa yang sudah terdaftar pada sistem.
 *
 * Operasi ini biasanya digunakan pada:
 *
 * - Halaman edit profil siswa
 * - Perubahan data administrasi siswa
 * - Koreksi data siswa oleh operator sekolah
 *
 * ------------------------------------------------------------
 * TANGGUNG JAWAB
 * ------------------------------------------------------------
 *
 * - Memvalidasi ID siswa
 * - Memastikan data siswa tersedia
 * - Mengirim perubahan data ke repository
 *
 * ------------------------------------------------------------
 * BUSINESS RULES
 * ------------------------------------------------------------
 *
 * - Student ID wajib diisi
 * - Data siswa harus ada sebelum diperbarui
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
 * UpdateStudentUseCase
 *      ↓
 * StudentRepository
 *      ↓
 * Prisma
 *
 * ------------------------------------------------------------
 * INPUT
 * ------------------------------------------------------------
 *
 * UpdateStudentDTO
 *
 * ------------------------------------------------------------
 * OUTPUT
 * ------------------------------------------------------------
 *
 * StudentIdentityDTO
 *
 * ------------------------------------------------------------
 * ERROR YANG DAPAT DILEMPAR
 * ------------------------------------------------------------
 *
 * @throws AppError.validation
 * Jika Student ID tidak diisi
 *
 * @throws AppError.notFound
 * Jika data siswa tidak ditemukan
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class UpdateStudentUseCase extends BaseUseCase<UpdateStudentDTO, StudentIdentityDTO> {
  constructor(private readonly repository: StudentInterface) {
    super();
  }

  protected async handle(dto: UpdateStudentDTO): Promise<StudentIdentityDTO> {
    if (!dto.id) {
      throw AppError.validation(STUDENT_ERRORS.STUDENT_ID_IS_REQUIRED);
    }

    const existing = await this.repository.findById(dto.id);

    if (!existing) {
      throw AppError.notFound(STUDENT_ERRORS.STUDENT_NOT_FOUND);
    }

    return this.repository.update(dto);
  }
}
