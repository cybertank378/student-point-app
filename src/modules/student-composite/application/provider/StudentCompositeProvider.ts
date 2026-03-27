//Files: src/modules/student-composite/application/provider/StudentCompositeProvider.ts
// Files: src/modules/student-composite/application/provider/StudentCompositeProvider.ts

import { StudentCompositeService } from "@/modules/student-composite/application/services/StudentCompositeService";
import { StudentCompositeRepository } from "@/modules/student-composite/infrastructure/repo/StudentCompositeRepository";

/**
 * ============================================================
 * STUDENT COMPOSITE PROVIDER
 * ============================================================
 *
 * Composition Root untuk modul StudentComposite.
 *
 * Provider bertanggung jawab untuk:
 *
 * - Menginisialisasi repository
 * - Menghubungkan repository dengan service
 * - Menyediakan service siap pakai untuk controller
 *
 * ------------------------------------------------------------
 * DEPENDENCY GRAPH
 * ------------------------------------------------------------
 *
 * Repository
 *      ↓
 * Service
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class StudentCompositeProvider {
  /**
   * ============================================================
   * BUILD STUDENT COMPOSITE SERVICE
   * ============================================================
   *
   * Membuat instance StudentCompositeService
   * dengan dependency repository.
   *
   * Digunakan oleh:
   *
   * - StudentCompositeController
   *
   * ------------------------------------------------------------
   * RETURNS
   * ------------------------------------------------------------
   *
   * @returns {StudentCompositeService}
   */

  static service(): StudentCompositeService {
    /* ========================================================
     REPOSITORY
     ======================================================== */

    const repository = new StudentCompositeRepository();

    /* ========================================================
     SERVICE
     ======================================================== */

    return new StudentCompositeService(repository);
  }
}
