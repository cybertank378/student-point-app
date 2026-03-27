import type { AddStudentAchievementDTO } from "../dto/AddStudentAchievementDTO";
import type { StudentAchievement } from "../entity/StudentAchievement";

/**
 * ============================================================
 * STUDENT ACHIEVEMENT REPOSITORY PORT
 * ============================================================
 *
 * Domain repository contract responsible for persistence
 * operations related to StudentAchievement write model.
 *
 * Read operations must be performed through StudentComposite.
 */

export interface StudentAchievementInterface {
  /**
   * Persist a new student achievement record.
   */
  assign(data: AddStudentAchievementDTO): Promise<StudentAchievement>;

  /**
   * Remove an existing student achievement record.
   */
  remove(id: string): Promise<void>;

  /**
   * Retrieve an achievement by identifier for write validation.
   */
  findById(id: string): Promise<StudentAchievement | null>;

  findByAcademicYear(studentId: string, academicYearId: string): Promise<StudentAchievement[]>;
}
