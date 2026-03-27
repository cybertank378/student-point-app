//Files: src/modules/student-report/infrastructure/http/controller/StudentReportController.ts

import type { NextRequest } from "next/server";

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { StudentReportService } from "@/modules/student-report/application/service/StudentReportService";

/**
 * ============================================================
 * STUDENT REPORT CONTROLLER
 * ============================================================
 *
 * HTTP adapter responsible for handling student report
 * and statistics related requests.
 *
 * Responsibilities:
 * - parse HTTP request
 * - call application service
 * - return standardized HTTP response
 */
export class StudentReportController {
  constructor(private readonly service: StudentReportService) {}

  /**
   * ============================================================
   * GET STUDENT BASE STATISTICS
   * ============================================================
   */
  async studentStatistic(_req: NextRequest): Promise<Response> {
    const result = await this.service.studentStatistic();

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET GENDER DISTRIBUTION STATISTICS
   * ============================================================
   */
  async genderStatistic(_req: NextRequest): Promise<Response> {
    const result = await this.service.genderStatistic();

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET DISABILITY STATISTICS
   * ============================================================
   */
  async disabilityStatistic(_req: NextRequest): Promise<Response> {
    const result = await this.service.disabilityStatistic();

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET CLASS DISTRIBUTION STATISTICS
   * ============================================================
   */
  async classStatistics(_req: NextRequest): Promise<Response> {
    const result = await this.service.classStatistics();

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET ATTENDANCE STATISTICS
   * ============================================================
   */
  async attendanceStatistic(_req: NextRequest): Promise<Response> {
    const result = await this.service.attendanceStatistic();

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET COUNSELING STATISTICS
   * ============================================================
   */
  async counselingStatistic(_req: NextRequest): Promise<Response> {
    const result = await this.service.counselingStatistic();

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET VIOLATION STATISTICS
   * ============================================================
   */
  async violationStatistic(_req: NextRequest): Promise<Response> {
    const result = await this.service.violationStatistic();

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET VIOLATION HEATMAP
   * ============================================================
   */
  async violationHeatmap(_req: NextRequest): Promise<Response> {
    const result = await this.service.violationHeatmap();

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET VIOLATION TREND
   * ============================================================
   */
  async violationTrend(_req: NextRequest): Promise<Response> {
    const result = await this.service.violationTrend();

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET TOP VIOLATION STUDENTS
   * ============================================================
   */
  async topViolationStudents(req: NextRequest): Promise<Response> {
    const { searchParams } = new URL(req.url);

    const limitParam = searchParams.get("limit");

    const limit = limitParam ? Number(limitParam) : 10;

    const result = await this.service.topViolationStudents(limit);

    return HttpResultHandler.handle(result);
  }
}
