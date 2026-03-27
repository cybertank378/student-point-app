// Files: src/modules/student-composite/application/usecases/ListCompositeCollectionUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import { AppError } from "@/modules/shared/errors/AppError";

import type { BasePaginationParams, BasePaginationResponse } from "@/modules/shared/http/pagination/BasePagination";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import type { StudentCompositeInterface } from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface";
import type { StudentCollectionKey } from "@/modules/student-composite/domain/types/StudentCollectionKey";

/**
 * ============================================================
 * LIST STUDENT COLLECTION USE CASE
 * ============================================================
 *
 * Use case ini digunakan untuk mengambil
 * **koleksi data turunan siswa secara dinamis**
 * berdasarkan jenis koleksi tertentu.
 *
 * Koleksi yang dapat diambil antara lain:
 *
 * - achievements
 * - violations
 * - attendances
 * - parents
 * - enrollments
 * - aids
 * - counselingCases
 *
 * Use case ini memungkinkan API endpoint seperti:
 *
 * GET /students/:id/achievements
 * GET /students/:id/violations
 * GET /students/:id/attendances
 *
 * Semua endpoint tersebut menggunakan
 * use case yang sama dengan parameter collection.
 *
 * ------------------------------------------------------------
 * FLOW EKSEKUSI
 * ------------------------------------------------------------
 *
 * Controller
 *      ↓
 * StudentCompositeService
 *      ↓
 * ListCompositeCollectionUseCase
 *      ↓
 * StudentCompositeRepository
 *      ↓
 * Prisma
 *
 * ------------------------------------------------------------
 * VALIDASI
 * ------------------------------------------------------------
 *
 * - studentId wajib diisi
 * - collection wajib ditentukan
 *
 * ------------------------------------------------------------
 * PARAMETER
 * ------------------------------------------------------------
 *
 * Request:
 *
 * - studentId
 * - collection
 * - params (pagination)
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

interface Request<K extends StudentCollectionKey> {
  studentId: string;

  collection: K;

  params: BasePaginationParams;
}

export class ListCompositeCollectionUseCase<K extends StudentCollectionKey> extends BaseUseCase<
  Request<K>,
  BasePaginationResponse<StudentCompositeDTO[K][number]>
> {
  constructor(readonly repository: StudentCompositeInterface) {
    super();
  }

  protected async handle(request: Request<K>): Promise<BasePaginationResponse<StudentCompositeDTO[K][number]>> {
    const { studentId, collection, params } = request;

    if (!studentId) {
      throw AppError.validation("Student ID wajib diisi");
    }

    if (!collection) {
      throw AppError.validation("Collection wajib ditentukan");
    }

    return this.repository.listStudentCollection(studentId, collection, params);
  }
}
