import type { NextRequest } from "next/server";

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { StudentAchievementService } from "@/modules/student-achievement/application/services/StudentAchievementServices";

import type { AddStudentAchievementDTO } from "@/modules/student-achievement/domain/dto/AddStudentAchievementDTO";
import {
  CreateStudentAchievementSchema,
  RemoveStudentAchievementSchema,
} from "@/modules/student-achievement/infrastructure/validators/studentAchievement.validator";

/**
 * ============================================================
 * STUDENT ACHIEVEMENT CONTROLLER
 * ============================================================
 *
 * HTTP adapter responsible for handling student achievement requests.
 *
 * Responsibilities:
 * - Parse HTTP request
 * - Validate input using Zod schema
 * - Delegate execution to application service
 * - Return standardized HTTP response
 *
 * Controller must remain free of business logic.
 */

export class StudentAchievementController {
  constructor(private readonly service: StudentAchievementService) {}

  /**
   * ============================================================
   * LIST STUDENT ACHIEVEMENTS
   * ============================================================
   *
   * Retrieve all achievements belonging to a student.
   */

  async list(_req: NextRequest, studentId: string): Promise<Response> {
    const result = await this.service.listStudentAchievements(studentId);

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * GET STUDENT ACHIEVEMENT
   * ============================================================
   *
   * Retrieve specific student achievement.
   */

  async get(_req: NextRequest, studentId: string, achievementId: string): Promise<Response> {
    const result = await this.service.getStudentAchievement(studentId, achievementId);

    return HttpResultHandler.handle(result);
  }

  /**
   * ============================================================
   * CREATE STUDENT ACHIEVEMENT
   * ============================================================
   *
   * Assign achievement record to student.
   */

  async create(req: NextRequest, studentId: string): Promise<Response> {
    const body = CreateStudentAchievementSchema.parse(await req.json());

    const dto: AddStudentAchievementDTO = {
      studentId,

      achievementId: body.achievementId,
      academicYearId: body.academicYearId,

      point: body.point,

      achievedAt: body.achievedAt,
    };

    const result = await this.service.addStudentAchievement(dto);

    return HttpResultHandler.handle(result, 201);
  }

  /**
   * ============================================================
   * DELETE STUDENT ACHIEVEMENT
   * ============================================================
   *
   * Remove achievement record.
   */

  async remove(_req: NextRequest, achievementId: string): Promise<Response> {
    RemoveStudentAchievementSchema.parse({
      achievementId,
    });

    const result = await this.service.removeStudentAchievement(achievementId);

    return HttpResultHandler.handle(result);
  }
}
