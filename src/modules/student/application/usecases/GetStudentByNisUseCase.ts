// Files: src/modules/student/application/usecases/GetStudentByIdUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import { STUDENT_ERRORS } from "@/modules/student/domain/constants/studentErrorMessages";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";
import type { StudentRepository } from "@/modules/student/infrastructure/repo/StudentRepository";
import type { StudentCompositeService } from "@/modules/student-composite/application/services/StudentCompositeService";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

/**
 * ============================================================
 * GET STUDENT BY NIS USE CASE
 * ============================================================
 *
 * Use case ini mengambil **profil komposit siswa**
 * berdasarkan **NIS (Nomor Induk Siswa)**.
 *
 * ------------------------------------------------------------
 * FLOW
 * ------------------------------------------------------------
 *
 * NIS
 *  ↓
 * StudentRepository.findByNis
 *  ↓
 * StudentIdentityDTO
 *  ↓
 * studentId
 *  ↓
 * StudentCompositeService.getStudentComposite
 *  ↓
 * StudentCompositeDTO
 *
 * ------------------------------------------------------------
 * RESPONSIBILITY
 * ------------------------------------------------------------
 *
 * - Validasi NIS
 * - Mengambil studentId dari repository
 * - Mengambil profil komposit siswa
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class GetStudentByNisUseCase extends BaseUseCase<string, StudentCompositeDTO> {
  constructor(
    private readonly studentRepository: StudentInterface,
    private readonly compositeService: StudentCompositeService
  ) {
    super();
  }

  protected async handle(nis: string): Promise<StudentCompositeDTO> {
    /**
     * Validasi NIS
     */
    if (!nis || nis.trim().length === 0) {
      throw AppError.validation(STUDENT_ERRORS.NIS_INVALID);
    }

    /**
     * Cari siswa berdasarkan NIS
     */
    const student = await this.studentRepository.findByNis(nis);

    if (!student) {
      throw AppError.notFound(STUDENT_ERRORS.STUDENT_NOT_FOUND);
    }

    /**
     * Ambil studentId
     */
    const studentId = student.id;

    /**
     * Ambil profil komposit siswa
     */
    const result = await this.compositeService.getStudentComposite(studentId);

    if (result.isFailure) {
      throw result.error;
    }

    return result.getValue();
  }
}
