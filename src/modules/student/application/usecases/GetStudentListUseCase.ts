// src/modules/student/application/usecases/GetStudentListUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { BasePaginationParams, BasePaginationResponse } from "@/modules/shared/http/pagination/BasePagination";
import { STUDENT_ERRORS } from "@/modules/student/domain/constants/studentErrorMessages";
import type { StudentCompositeService } from "@/modules/student-composite/application/services/StudentCompositeService";
import type { StudentListCompositeDTO } from "@/modules/student-composite/domain/dto/StudentListCompositeDTO";
import {StudentListParams} from "@/modules/student-composite/domain/types/StudentListParams";

/**
 * ============================================================
 * GET STUDENT LIST USE CASE
 * ============================================================
 *
 * Use case ini mengambil daftar siswa menggunakan
 * modul StudentComposite sebagai read model.
 *
 * Data yang diambil meliputi:
 *
 * - Identitas siswa
 * - Enrollment aktif siswa
 * - Ringkasan poin disiplin siswa
 *
 * Use case ini digunakan oleh:
 *
 * - Student Table
 * - Student Search
 * - Student Export
 * - Dashboard monitoring siswa
 *
 * ------------------------------------------------------------
 * TANGGUNG JAWAB
 * ------------------------------------------------------------
 *
 * - Memvalidasi parameter pagination
 * - Mengambil data siswa melalui StudentCompositeService
 *
 * ------------------------------------------------------------
 * DEPENDENCY
 * ------------------------------------------------------------
 *
 * StudentCompositeService
 *
 * Service ini bertindak sebagai gateway menuju
 * modul StudentComposite untuk operasi READ.
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
 * GetStudentListUseCase
 *      ↓
 * StudentCompositeService
 *      ↓
 * StudentCompositeRepository
 *      ↓
 * Prisma
 *
 * ------------------------------------------------------------
 * INPUT
 * ------------------------------------------------------------
 *
 * BasePaginationParams
 *
 * ------------------------------------------------------------
 * OUTPUT
 * ------------------------------------------------------------
 *
 * BasePaginationResponse<StudentListCompositeDTO>
 *
 * ------------------------------------------------------------
 * ERROR YANG DAPAT DILEMPAR
 * ------------------------------------------------------------
 *
 * @throws AppError.validation
 * Jika halaman pagination tidak valid
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class GetStudentListUseCase extends BaseUseCase<StudentListParams, BasePaginationResponse<StudentListCompositeDTO>> {
  constructor(private readonly compositeService: StudentCompositeService) {
    super();
  }

  protected async handle(params: StudentListParams): Promise<BasePaginationResponse<StudentListCompositeDTO>> {
    /**
     * Validasi halaman pagination
     */
    if (params.page !== undefined && params.page < 1) {
      throw AppError.validation(STUDENT_ERRORS.PAGE_INVALID);
    }

    /**
     * Ambil data dari StudentComposite
     */
    const result = await this.compositeService.getStudentList(params);

    /**
     * Jika service gagal, lempar error ke BaseUseCase
     */
    if (result.isFailure) {
      throw result.error;
    }

    return result.getValue();
  }
}
