// Files: src/modules/student-point/application/usecases/RecalculateStudentPointUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import type { StudentAchievementInterface } from "@/modules/student-achievement/domain/interfaces/StudentAchievementInterface";
import type { StudentPointDTO } from "@/modules/student-point/domain/dto/StudentPointDTO";
import type { StudentPointInterface } from "@/modules/student-point/domain/interfaces/StudentPointInterface";
import { StudentPointMapper } from "@/modules/student-point/domain/mapper/StudentPointMapper";
import type { StudentViolationInterface } from "@/modules/student-violation/domain/interfaces/StudentViolationInterface";

/**
 * ============================================================
 * RECALCULATE STUDENT POINT USE CASE
 * ============================================================
 *
 * Recalculate total student points based on
 * violation and achievement points.
 *
 * Business Rules:
 * - studentId must exist
 * - academicYearId must exist
 * - student summary must exist
 *
 * Formula:
 *
 * totalPoint = achievementPoint - violationPoint
 *
 * Transaction handling is NOT performed here.
 * It should be orchestrated by the Service or
 * StudentComposite layer.
 */

export class RecalculateStudentPointUseCase extends BaseUseCase<
  {
    studentId: string;
    academicYearId: string;
  },
  StudentPointDTO
> {
  constructor(
    private readonly pointRepo: StudentPointInterface,
    private readonly violationRepo: StudentViolationInterface,
    private readonly achievementRepo: StudentAchievementInterface
  ) {
    super();
  }

  protected async handle(dto: { studentId: string; academicYearId: string }): Promise<StudentPointDTO> {
    const summary = await this.pointRepo.findByStudentAndAcademicYear(dto.studentId, dto.academicYearId);
    if (!summary) {
      throw AppError.notFound("Student point summary not found");
    }
    const violations = await this.violationRepo.findByAcademicYear(dto.studentId, dto.academicYearId);
    const achievements = await this.achievementRepo.findByAcademicYear(dto.studentId, dto.academicYearId);
    const violationPoint = violations.reduce((sum, v) => sum + v.point, 0);
    const achievementPoint = achievements.reduce((sum, a) => sum + a.point, 0);
    const recalculated = summary.recalculate(violationPoint, achievementPoint);
    const saved = await this.pointRepo.save(recalculated);
    return StudentPointMapper.toDTO(saved);
  }
}
