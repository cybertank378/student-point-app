import { StudentAchievement } from "../entity/StudentAchievement";

/**
 * ============================================================
 * STUDENT ACHIEVEMENT MAPPER
 * ============================================================
 *
 * Responsible for converting persistence records and
 * composite read models into domain entities.
 */

export class StudentAchievementMapper {
  /**
   * Map persistence layer (Prisma) to domain entity.
   */
  static fromPersistence(record: {
    id: string;
    studentId: string;
    achievementId: string;
    academicYearId: string;
    point: number;
    achievedAt: Date;
    createdAt: Date;
  }): StudentAchievement {
    return new StudentAchievement({
      id: record.id,
      studentId: record.studentId,
      achievementId: record.achievementId,
      academicYearId: record.academicYearId,
      point: record.point,
      achievedAt: record.achievedAt,
      createdAt: record.createdAt,
    });
  }

  /**
   * Map composite read model into domain entity.
   */
  static fromComposite(
    studentId: string,
    record: {
      id: string;
      achievementId: string;
      academicYearId: string;
      point: number;
      achievedAt: Date;
    }
  ): StudentAchievement {
    return new StudentAchievement({
      id: record.id,
      studentId,
      achievementId: record.achievementId,
      academicYearId: record.academicYearId,
      point: record.point,
      achievedAt: record.achievedAt,
      createdAt: new Date(),
    });
  }
}
