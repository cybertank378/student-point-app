//Files: src/modules/student/infrastructure/http/types/StudentChildControllers.ts

import type { StudentAchievementController } from "@/modules/student-achievement/infrastructure/http/StudentAchievementController";
import type { StudentAidController } from "@/modules/student-aid/infrastructure/http/StudentAidController";
import type { StudentCounselingController } from "@/modules/student-counseling/infrastructure/http/StudentCounselingController";
import type { StudentPointController } from "@/modules/student-point/infrastructure/http/StudentPointController";
import type { StudentProfileController } from "@/modules/student-profile/infrastructure/http/StudentProfileController";
import type { StudentReportController } from "@/modules/student-report/infrastructure/http/controller/StudentReportController";
import type { StudentViolationController } from "@/modules/student-violation/infrastructure/http/StudentViolationController";
import {
  StudentFamilyInfoController
} from "@/modules/student-family-info/infrastructure/http/StudentFamilyInfoController";
import {
  UploadStudentDocumentController
} from "@/modules/student-family-info/infrastructure/http/UploadStudentDocumentController";
import {
  DeleteStudentDocumentController
} from "@/modules/student-family-info/infrastructure/http/DeleteStudentDocumentController";

/**
 * ============================================================
 * STUDENT CHILD CONTROLLERS REGISTRY
 * ============================================================
 *
 * Type contract yang mendefinisikan seluruh controller
 * child-module yang berada di bawah aggregate root Student.
 *
 * Digunakan oleh:
 *
 * StudentProvider → untuk membuat registry
 * StudentChildRouter → untuk menerima dependency
 */

export type StudentChildControllers = {
  profile: StudentProfileController;

  aid: StudentAidController;

  point: StudentPointController;

  violation: StudentViolationController;

  achievement: StudentAchievementController;

  counseling: StudentCounselingController;

  report: StudentReportController;

  familyInfo: {
    crud: StudentFamilyInfoController;
    uploadDocument: UploadStudentDocumentController;
    deleteDocument: DeleteStudentDocumentController;
  };
};
