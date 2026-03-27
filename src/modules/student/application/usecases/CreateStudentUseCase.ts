// Files: src/modules/student/application/usecases/CreateStudentUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import { STUDENT_ERRORS } from "@/modules/student/domain/constants/studentErrorMessages";
import type { CreateStudentDTO, StudentIdentityDTO } from "@/modules/student/domain/dto";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

/**
 * ============================================================
 * CREATE STUDENT USE CASE
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk membuat
 * data siswa baru dalam sistem.
 *
 * Use case ini merupakan **entry point business logic**
 * untuk proses registrasi siswa pada modul Student.
 *
 * ------------------------------------------------------------
 * TANGGUNG JAWAB
 * ------------------------------------------------------------
 *
 * - Memvalidasi data siswa yang masuk
 * - Memastikan tidak ada duplikasi NISN
 * - Mengirim data ke repository untuk disimpan
 * - Mengembalikan entity siswa yang berhasil dibuat
 *
 * ------------------------------------------------------------
 * BUSINESS RULES
 * ------------------------------------------------------------
 *
 * - NISN wajib diisi
 * - Nama siswa wajib diisi
 * - Nama siswa minimal 2 karakter
 * - NISN tidak boleh duplikat
 *
 * ------------------------------------------------------------
 * DEPENDENCY
 * ------------------------------------------------------------
 *
 * StudentInterface (Repository Port)
 *
 * Repository bertanggung jawab untuk:
 *
 * - Persistensi data siswa
 * - Interaksi dengan database
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
 * CreateStudentUseCase
 *      ↓
 * StudentRepository
 *      ↓
 * Prisma
 *
 * ------------------------------------------------------------
 * INPUT
 * ------------------------------------------------------------
 *
 * CreateStudentDTO
 *
 * DTO ini berisi data siswa yang akan dibuat.
 *
 * ------------------------------------------------------------
 * OUTPUT
 * ------------------------------------------------------------
 *
 * StudentEntity
 *
 * Entity domain yang bersifat immutable.
 *
 * ------------------------------------------------------------
 * ERROR YANG DAPAT DILEMPAR
 * ------------------------------------------------------------
 *
 * @throws AppError.validation
 * Jika:
 * - NISN tidak diisi
 * - Nama siswa tidak diisi
 * - Nama siswa kurang dari 2 karakter
 *
 * @throws AppError.conflict
 * Jika:
 * - NISN sudah digunakan oleh siswa lain
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class CreateStudentUseCase extends BaseUseCase<CreateStudentDTO, StudentIdentityDTO> {
  constructor(private readonly repository: StudentInterface) {
    super();
  }

  protected async handle(dto: CreateStudentDTO): Promise<StudentIdentityDTO> {
    if (!dto.nisn) {
      throw AppError.validation(STUDENT_ERRORS.STUDENT_NISN_REQUIRED);
    }

    if (!dto.name) {
      throw AppError.validation(STUDENT_ERRORS.STUDENT_NAME_REQUIRED);
    }

    if (dto.name.length < 2) {
      throw AppError.validation(STUDENT_ERRORS.STUDENT_NAME_MINIMUM_CHAR);
    }

    const exists = await this.repository.existsByNISN(dto.nisn);

    if (exists) {
      throw AppError.conflict(STUDENT_ERRORS.NISN_ALREADY_EXISTS);
    }

    return this.repository.create(dto);
  }
}
