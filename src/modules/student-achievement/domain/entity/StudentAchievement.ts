// Files: src/modules/student-achievement/domain/entity/StudentAchievement.ts

/**
 * ============================================================
 * STUDENT ACHIEVEMENT ENTITY
 * ============================================================
 *
 * Domain representation of a student achievement record.
 */

export class StudentAchievement {
  readonly id: string;
  readonly studentId: string;
  readonly achievementId: string;
  readonly academicYearId: string;
  readonly point: number;
  readonly achievedAt: Date;
  readonly createdAt: Date;

  constructor(props: {
    id: string;
    studentId: string;
    achievementId: string;
    academicYearId: string;
    point: number;
    achievedAt: Date;
    createdAt: Date;
  }) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.achievementId = props.achievementId;
    this.academicYearId = props.academicYearId;
    this.point = props.point;
    this.achievedAt = props.achievedAt;
    this.createdAt = props.createdAt;
  }
}
