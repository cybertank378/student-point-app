//Files: src/modules/student-achievement/domain/domain/dto/AddStudentAchievementDTO.ts

/**
 * ============================================================
 * ADD STUDENT ACHIEVEMENT DTO
 * ============================================================
 */

export interface AddStudentAchievementDTO {
  studentId: string;
  achievementId: string;
  academicYearId: string;
  point: number;
  achievedAt: Date;
}
