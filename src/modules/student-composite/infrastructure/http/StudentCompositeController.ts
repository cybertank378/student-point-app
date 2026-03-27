//Files: src/modules/student-composite/infrastructure/http/StudentCompositeController.ts
import type { NextRequest } from "next/server";
import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { BasePaginationParams } from "@/modules/shared/http/pagination/BasePagination";
import { StudentCompositeProvider } from "@/modules/student-composite/application/provider/StudentCompositeProvider";

import type { StudentCollectionKey } from "@/modules/student-composite/domain/types/StudentCollectionKey";

/**
 * ============================================================
 * STUDENT COMPOSITE CONTROLLER
 * ============================================================
 *
 * Controller ini merupakan **HTTP Adapter**
 * untuk modul StudentComposite pada arsitektur
 * Hexagonal / Clean Architecture.
 *
 * Controller bertanggung jawab untuk:
 *
 * - menerima request HTTP
 * - mengekstrak parameter dari request
 * - memanggil Application Service
 * - mengubah Result<T> menjadi HTTP Response
 *
 * Controller **tidak mengandung business logic**.
 *
 * ------------------------------------------------------------
 * FLOW EKSEKUSI
 * ------------------------------------------------------------
 *
 * HTTP Request
 *      ↓
 * Controller
 *      ↓
 * StudentCompositeService
 *      ↓
 * UseCase
 *      ↓
 * Repository
 *      ↓
 * Database
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Infrastructure Layer
 */

export class StudentCompositeController {
  /**
   * ============================================================
   * SERVICE INSTANCE
   * ============================================================
   */

  private readonly service = StudentCompositeProvider.service();

  /**
   * ============================================================
   * GET STUDENT COMPOSITE PROFILE
   * ============================================================
   *
   * Endpoint:
   *
   * GET /students/:id/composite
   *
   * Mengambil profil komposit lengkap siswa.
   */

  getComposite = async (
    _req: NextRequest,

    studentId: string
  ): Promise<Response> => HttpResultHandler.handle(await this.service.getStudentComposite(studentId));

  /**
   * ============================================================
   * GET STUDENT LIST
   * ============================================================
   *
   * Endpoint:
   *
   * GET /students
   *
   * Mengambil daftar siswa dengan pagination.
   */

  getStudentList = async (req: NextRequest): Promise<Response> => {
    const { searchParams } = new URL(req.url);

    const params: BasePaginationParams = {
      page: Number(searchParams.get("page") ?? 1),

      limit: Number(searchParams.get("limit") ?? 10),
    };

    return HttpResultHandler.handle(await this.service.getStudentList(params));
  };

  /**
   * ============================================================
   * GET STUDENT CHILD COLLECTION
   * ============================================================
   *
   * Endpoint:
   *
   * GET /students/:id/:collection
   *
   * Contoh:
   *
   * GET /students/:id/achievements
   * GET /students/:id/violations
   * GET /students/:id/attendances
   */

  listCollection = async (
    req: NextRequest,

    studentId: string,

    collection: StudentCollectionKey
  ): Promise<Response> => {
    const { searchParams } = new URL(req.url);

    const params: BasePaginationParams = {
      page: Number(searchParams.get("page") ?? 1),

      limit: Number(searchParams.get("limit") ?? 10),
    };

    return HttpResultHandler.handle(await this.service.listStudentCollection(studentId, collection, params));
  };
}
