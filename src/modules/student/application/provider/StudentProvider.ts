//Files : src/modules/student/application/provider/StudentProvider.ts
import { ExcelAdapter } from "@/modules/shared/core/ExcelAdapter";
import { LocalFileStorageService } from "@/modules/shared/http/interface/LocalFileStorageService";
import { StudentChildFactory } from "@/modules/student/application/provider/StudentChildFactory";
import { StudentSharedFactory } from "@/modules/student/application/provider/StudentSharedFactory";
import { StudentService } from "@/modules/student/application/services/StudentService";
import { StudentChildRouter } from "@/modules/student/infrastructure/http/StudentChildRouter";
import { StudentController } from "@/modules/student/infrastructure/http/StudentController";
import type { StudentChildControllers } from "@/modules/student/infrastructure/http/types/StudentChildControllers";
import { StudentRepository } from "@/modules/student/infrastructure/repo/StudentRepository";

/**
 * ============================================================
 * STUDENT PROVIDER
 * ============================================================
 *
 * Composition Root untuk modul Student.
 *
 * Provider ini bertanggung jawab untuk:
 *
 * • Menginisialisasi dependency modul Student
 * • Menghubungkan parent module dengan child-module
 * • Menyediakan controller untuk API Route
 *
 * ------------------------------------------------------------
 * ENTRY POINT YANG DISEDIAKAN
 * ------------------------------------------------------------
 *
 * controller()
 *    → digunakan oleh route parent
 *
 * childRouter()
 *    → digunakan oleh route child-module
 *
 * ------------------------------------------------------------
 * ARCHITECTURE FLOW
 * ------------------------------------------------------------
 *
 * Next.js Route
 *        ↓
 * StudentProvider
 *        ↓
 * Controller / ChildRouter
 *        ↓
 * Service
 *        ↓
 * UseCase
 *        ↓
 * Repository
 */

class StudentProvider {
  /**
   * ============================================================
   * BUILD STUDENT CONTROLLER
   * ============================================================
   *
   * Method ini membuat controller utama modul Student.
   *
   * Controller ini menangani operasi parent module:
   *
   * • Create Student
   * • Update Student
   * • Delete Student
   * • Get Student
   * • Search Student
   * • Import / Export
   * • Upload a Photo
   *
   * @returns {StudentController}
   */
  static controller(): StudentController {
    const repo = new StudentRepository();

    const storage = new LocalFileStorageService();

    const compositeService = StudentSharedFactory.compositeService();

    const service = new StudentService(repo, compositeService, storage);

    const excelAdapter = new ExcelAdapter();

    return new StudentController(service, excelAdapter);
  }

  /**
   * ============================================================
   * BUILD STUDENT CHILD ROUTER
   * ============================================================
   *
   * Method ini membuat router agregasi untuk
   * seluruh child-module Student.
   *
   * Child-module yang didukung:
   *
   * • Student Profile
   * • Student Aid
   * • Student Point
   * • Student Violation
   * • Student Achievement
   * • Student Counseling
   *
   * Router ini digunakan oleh Next.js API Route
   * untuk meneruskan request ke controller child-module.
   *
   * @returns {StudentChildRouter}
   */

  static childRouter(): StudentChildRouter {
    const compositeRepo = StudentSharedFactory.compositeRepo();

    const controllers: StudentChildControllers = {
      profile: StudentChildFactory.profile(compositeRepo),
      aid: StudentChildFactory.aid(),
      point: StudentChildFactory.point(),
      violation: StudentChildFactory.violation(compositeRepo),
      achievement: StudentChildFactory.achievement(compositeRepo),
      counseling: StudentChildFactory.counseling(compositeRepo),
      report: StudentChildFactory.report(),
      familyInfo: StudentChildFactory.familyInfo(),
    };

    return new StudentChildRouter(controllers);
  }
}

export default StudentProvider;
