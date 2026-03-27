//Files: src/modules/student-report/application/service/StudentReportService.ts
// Files: src/modules/student-report/application/services/StudentReportService.ts

import { BaseAppServices } from "@/modules/shared/core/BaseAppServices";
import {
  GetAttendanceStatisticUseCase,
  GetClassStatisticsUseCase,
  GetCounselingStatisticUseCase,
  GetDisabilityStatisticUseCase,
  GetGenderStatisticUseCase,
  GetStudentStatisticUseCase,
  GetTopViolationStudentsUseCase,
  GetViolationHeatmapUseCase,
  GetViolationStatisticUseCase,
  GetViolationTrendUseCase,
} from "@/modules/student-report/application/usecase";
import type { StudentReportInterface } from "@/modules/student-report/domain/interfaces/StudentReportInterface";

/**
 * ============================================================
 * STUDENT REPORT SERVICE
 * ============================================================
 *
 * Application service responsible for orchestrating
 * student reporting and analytics use cases.
 *
 * Responsibilities:
 * - delegate execution to use cases
 * - provide a simple API for controllers
 * - keep controllers thin
 *
 * Business rules must remain inside UseCases.
 */
export class StudentReportService extends BaseAppServices {
  private readonly attendanceUC: GetAttendanceStatisticUseCase;
  private readonly classStatUC: GetClassStatisticsUseCase;
  private readonly counselingUC: GetCounselingStatisticUseCase;
  private readonly disabilityUC: GetDisabilityStatisticUseCase;
  private readonly genderUC: GetGenderStatisticUseCase;
  private readonly studentUC: GetStudentStatisticUseCase;
  private readonly topViolationUC: GetTopViolationStudentsUseCase;
  private readonly heatmapUC: GetViolationHeatmapUseCase;
  private readonly violationStatUC: GetViolationStatisticUseCase;
  private readonly violationTrendUC: GetViolationTrendUseCase;

  constructor(repo: StudentReportInterface) {
    super();

    this.attendanceUC = new GetAttendanceStatisticUseCase(repo);

    this.classStatUC = new GetClassStatisticsUseCase(repo);

    this.counselingUC = new GetCounselingStatisticUseCase(repo);

    this.disabilityUC = new GetDisabilityStatisticUseCase(repo);

    this.genderUC = new GetGenderStatisticUseCase(repo);

    this.studentUC = new GetStudentStatisticUseCase(repo);

    this.topViolationUC = new GetTopViolationStudentsUseCase(repo);

    this.heatmapUC = new GetViolationHeatmapUseCase(repo);

    this.violationStatUC = new GetViolationStatisticUseCase(repo);

    this.violationTrendUC = new GetViolationTrendUseCase(repo);
  }

  /**
   * Retrieve student base statistics
   */
  studentStatistic = () => this.execute(this.studentUC);

  /**
   * Retrieve gender distribution statistics
   */
  genderStatistic = () => this.execute(this.genderUC);

  /**
   * Retrieve disability statistics
   */
  disabilityStatistic = () => this.execute(this.disabilityUC);

  /**
   * Retrieve class distribution statistics
   */
  classStatistics = () => this.execute(this.classStatUC);

  /**
   * Retrieve attendance statistics
   */
  attendanceStatistic = () => this.execute(this.attendanceUC);

  /**
   * Retrieve counseling statistics
   */
  counselingStatistic = () => this.execute(this.counselingUC);

  /**
   * Retrieve violation statistics
   */
  violationStatistic = () => this.execute(this.violationStatUC);

  /**
   * Retrieve violation heatmap
   */
  violationHeatmap = () => this.execute(this.heatmapUC);

  /**
   * Retrieve violation trend
   */
  violationTrend = () => this.execute(this.violationTrendUC);

  /**
   * Retrieve top violation students
   */
  topViolationStudents = (limit: number) => this.execute(this.topViolationUC, limit);
}
