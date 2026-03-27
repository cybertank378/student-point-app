//Files: src/modules/student-composite/application/usecases/GetStudentListCompositeUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { BasePaginationParams, BasePaginationResponse } from "@/modules/shared/http/pagination/BasePagination";
import type { StudentListCompositeDTO } from "@/modules/student-composite/domain/dto/StudentListCompositeDTO";
import type { StudentCompositeInterface } from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface";
import {StudentListParams} from "@/modules/student-composite/domain/types/StudentListParams";

/**
 * ============================================================
 * GET STUDENT LIST COMPOSITE USE CASE
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil
 * **daftar siswa dalam bentuk read model ringan**
 * yang dioptimalkan untuk kebutuhan pagination besar.
 *
 * Data yang diambil meliputi:
 *
 * - Informasi inti siswa
 * - Enrollment aktif siswa
 * - Ringkasan poin disiplin siswa
 *
 * Use case ini digunakan oleh:
 *
 * - Tabel daftar siswa
 * - Pencarian siswa
 * - Export data siswa
 * - Dashboard monitoring siswa
 *
 * DTO yang digunakan bersifat minimal untuk
 * menghindari over-fetching data pada query besar.
 *
 * ------------------------------------------------------------
 * FLOW EKSEKUSI
 * ------------------------------------------------------------
 *
 * Controller
 *      ↓
 * StudentCompositeService
 *      ↓
 * GetStudentListCompositeUseCase
 *      ↓
 * StudentCompositeRepository
 *      ↓
 * Prisma
 *
 * ------------------------------------------------------------
 * PARAMETER
 * ------------------------------------------------------------
 *
 * BasePaginationParams
 *
 * - page
 * - limit
 *
 * ------------------------------------------------------------
 * DEPENDENCY
 * ------------------------------------------------------------
 *
 * StudentCompositeInterface
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class GetStudentListCompositeUseCase extends BaseUseCase<StudentListParams, BasePaginationResponse<StudentListCompositeDTO>> {
  constructor(readonly repository: StudentCompositeInterface) {
    super();
  }

  protected async handle(params: StudentListParams): Promise<BasePaginationResponse<StudentListCompositeDTO>> {

    return this.repository.findStudentList(params);
  }
}
