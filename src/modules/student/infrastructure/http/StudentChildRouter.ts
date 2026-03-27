//Files : src/modules/student/infrastructure/http/StudentChildRouter.ts
//Files: src/modules/student/infrastructure/http/StudentChildRouter.ts

import type { NextRequest } from "next/server";

import type { StudentChildControllers } from "@/modules/student/infrastructure/http/types/StudentChildControllers";
import {
  StudentFamilyInfoRepository
} from "@/modules/student-family-info/infrastructure/repo/StudentFamilyInfoRepository";
import {LocalFileStorageService} from "@/modules/shared/http/interface/LocalFileStorageService";
import {StudentFamilyInfoService} from "@/modules/student-family-info/application/services/StudentFamilyInfoService";

/**
 * ============================================================
 * STUDENT CHILD ROUTER
 * ============================================================
 *
 * Router agregasi yang berfungsi sebagai **gateway**
 * antara Student Aggregate dan seluruh child-module.
 *
 * Router ini bertanggung jawab untuk:
 *
 * - menerima request dari Next.js API Route
 * - meneruskan request ke controller child-module
 * - menjaga agar semua resource terkait siswa
 *   tetap berada di bawah aggregate root **Student**
 *
 * Router ini **tidak mengandung business logic**.
 * Seluruh aturan bisnis tetap berada pada:
 *
 * Controller → Service → UseCase
 *
 * ------------------------------------------------------------
 * POSISI DALAM ARSITEKTUR
 * ------------------------------------------------------------
 *
 * Next.js Route
 *        ↓
 * StudentChildRouter
 *        ↓
 * Child Module Controller
 *        ↓
 * Application Service
 *        ↓
 * UseCase
 *
 * ------------------------------------------------------------
 * KONSEP DDD
 * ------------------------------------------------------------
 *
 * Student diperlakukan sebagai **Aggregate Root**.
 *
 * Oleh karena itu seluruh resource yang berkaitan
 * dengan siswa harus diakses melalui gateway ini.
 *
 * Contoh endpoint:
 *
 * /students/:id/profile
 * /students/:id/violations
 * /students/:id/achievements
 * /students/:id/counseling
 *
 * ------------------------------------------------------------
 * CONTROLLER REGISTRY
 * ------------------------------------------------------------
 *
 * Router ini menggunakan **Controller Registry Pattern**
 * untuk menghindari constructor parameter yang terlalu banyak.
 *
 * Semua controller disimpan dalam satu objek registry
 * bernama `StudentChildControllers`.
 *
 * ------------------------------------------------------------
 * KEUNTUNGAN DESAIN INI
 * ------------------------------------------------------------
 *
 * • Constructor router tetap sederhana
 * • Mudah menambahkan child-module baru
 * • Dependency injection lebih rapi
 * • Arsitektur tetap scalable ketika module bertambah
 */

export class StudentChildRouter {
  constructor(private readonly controllers: StudentChildControllers) {}

  /**
   * PROFILE
   */

  getProfile = (req: NextRequest, studentId: string) => this.controllers.profile.get(req, studentId);

  updateProfile = (req: NextRequest, studentId: string) => this.controllers.profile.update(req, studentId);

  deleteProfile = (req: NextRequest, studentId: string) => this.controllers.profile.delete(req, studentId);

  /**
   * AID
   */

  getStudentAid = (req: NextRequest, studentId: string) => this.controllers.aid.get(req, studentId);

  createStudentAid = (req: NextRequest, studentId: string) => this.controllers.aid.create(req, studentId);

  updateStudentAid = (req: NextRequest, studentId: string) => this.controllers.aid.update(req, studentId);

  /**
   * POINT
   */

  getStudentPointSummary = (req: NextRequest, studentId: string, academicYearId: string) =>
    this.controllers.point.get(req, studentId, academicYearId);

  listStudentPointSummary = (req: NextRequest, academicYearId: string) => this.controllers.point.list(req, academicYearId);

  recalculateStudentPoint = (req: NextRequest, studentId: string) => this.controllers.point.recalculate(req, studentId);

  /**
   * VIOLATION
   */

  listViolations = (req: NextRequest, studentId: string) => this.controllers.violation.list(req, studentId);

  recordViolation = (req: NextRequest, studentId: string) => this.controllers.violation.create(req, studentId);

  resolveViolation = (req: NextRequest, violationId: string) => this.controllers.violation.resolve(req, violationId);

  violationHistory = (req: NextRequest, studentId: string, academicYearId: string) =>
    this.controllers.violation.history(req, studentId, academicYearId);

  /**
   * ACHIEVEMENT
   */

  listStudentAchievements = (req: NextRequest, studentId: string) => this.controllers.achievement.list(req, studentId);

  addStudentAchievement = (req: NextRequest, studentId: string) => this.controllers.achievement.create(req, studentId);

  getStudentAchievement = (req: NextRequest, studentId: string, achievementId: string) =>
    this.controllers.achievement.get(req, studentId, achievementId);

  removeStudentAchievement = (req: NextRequest, achievementId: string) => this.controllers.achievement.remove(req, achievementId);

  /**
   * COUNSELING
   */

  openStudentCounselingCase = (req: NextRequest, studentId: string) => this.controllers.counseling.openCase(req, studentId);
  updateStudentCounselingCase = (req: NextRequest, caseId: string) => this.controllers.counseling.updateCase(req, caseId);
  closeStudentCounselingCase = (req: NextRequest, caseId: string) => this.controllers.counseling.closeCase(req, caseId);

  /**
   * REPORT
   */
  studentStatistic = (req: NextRequest) => this.controllers.report.studentStatistic(req);
  genderStatistic = (req: NextRequest) => this.controllers.report.genderStatistic(req);
  disabilityStatistic = (req: NextRequest) => this.controllers.report.disabilityStatistic(req);
  classStatistics = (req: NextRequest) => this.controllers.report.classStatistics(req);
  attendanceStatistic = (req: NextRequest) => this.controllers.report.attendanceStatistic(req);
  counselingStatistic = (req: NextRequest) => this.controllers.report.counselingStatistic(req);
  violationStatistic = (req: NextRequest) => this.controllers.report.violationStatistic(req);
  violationHeatmap = (req: NextRequest) => this.controllers.report.violationHeatmap(req);
  violationTrend = (req: NextRequest) => this.controllers.report.violationTrend(req);
  topViolationStudents = (req: NextRequest) => this.controllers.report.topViolationStudents(req);
  /**
   * FAMILY INFO
   */

  getFamilyInfo = (req: NextRequest, id: string) =>  this.controllers.familyInfo.crud.get(req, id)
  createFamilyInfo = (req: NextRequest, id: string) => this.controllers.familyInfo.crud.create(req, id)
  updateFamilyInfo = (req: NextRequest, id: string) => this.controllers.familyInfo.crud.update(req, id)
  deleteFamilyInfo = (_req: NextRequest, id: string) => this.controllers.familyInfo.crud.delete(id)
  uploadDocument = (req: Request, studentId: string) =>this.controllers.familyInfo.uploadDocument.upload(req, studentId)
  deleteDocument = (req: Request, studentId: string) =>this.controllers.familyInfo.deleteDocument.delete(req, studentId)

}
