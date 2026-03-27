//Files: src/modules/student/application/provider/StudentSharedFactory.ts

import { StudentRepository } from "@/modules/student/infrastructure/repo/StudentRepository";
import { StudentCompositeService } from "@/modules/student-composite/application/services/StudentCompositeService";
import { StudentCompositeRepository } from "@/modules/student-composite/infrastructure/repo/StudentCompositeRepository";

/**
 * ============================================================
 * STUDENT SHARED FACTORY
 * ============================================================
 *
 * Factory untuk dependency yang digunakan oleh
 * banyak child module.
 */

export class StudentSharedFactory {
  static compositeRepo() {
    return new StudentCompositeRepository();
  }

  static studentRepo() {
    return new StudentRepository();
  }

  static compositeService(): StudentCompositeService {
    const repo = StudentSharedFactory.compositeRepo();

    return new StudentCompositeService(repo);
  }
}
