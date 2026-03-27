// Files: src/modules/student-violation/domain/interfaces/StudentViolationInterface.ts

import type { ViolationActionType, ViolationResolutionStatus } from "@/libs/utils/enums";
import type { StudentViolation } from "@/modules/student-violation/domain/entity/StudentViolation";

/**
 * ============================================================
 * STUDENT VIOLATION REPOSITORY PORT
 * ============================================================
 *
 * Domain repository contract defining persistence operations
 * for StudentViolation aggregates.
 *
 * Implemented by infrastructure layer repositories.
 */
export interface StudentViolationInterface {
  save(violation: StudentViolation): Promise<void>;

  findById(violationId: string): Promise<StudentViolation | null>;

  findByStudentId(studentId: string): Promise<StudentViolation[]>;

  findByAcademicYear(studentId: string, academicYearId: string): Promise<StudentViolation[]>;

  resolveViolation(
    violationId: string,
    handlerTeacherId: string,
    status: ViolationResolutionStatus,
    action: ViolationActionType,
    note: string | null
  ): Promise<void>;
}
