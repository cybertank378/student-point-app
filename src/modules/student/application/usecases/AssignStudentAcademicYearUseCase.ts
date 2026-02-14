//Files: src/modules/student/application/usecases/AssignStudentAcademicYearUseCase.ts
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";
import type { Student } from "@/modules/student/domain/entity/Student";

/* =========================
   SINGLE ASSIGN
========================= */

interface AssignStudentAcademicYearInput {
  studentId: string;
  rombelId: string;
}

/* =========================
   BATCH ASSIGN
========================= */

interface BatchAssignInput {
  studentIds: string[];
  rombelId: string;
}

export class AssignStudentAcademicYearUsecase {
  constructor(private readonly studentRepo: StudentInterface) {}

  /* =========================
       SINGLE EXECUTE
    ========================= */

  async execute(input: AssignStudentAcademicYearInput): Promise<Student> {
    const { studentId, rombelId } = input;

    if (!studentId) {
      throw new Error("Student ID is required");
    }

    if (!rombelId) {
      throw new Error("Rombel ID is required");
    }

    const student = await this.studentRepo.findById(studentId);

    if (!student) {
      throw new Error("Student not found");
    }

    await this.studentRepo.assignToRombel(studentId, rombelId);

    const updated = await this.studentRepo.findById(studentId);

    if (!updated) {
      throw new Error("Failed to assign student to academic year");
    }

    return updated;
  }

  /* =========================
       BATCH EXECUTE
    ========================= */

  async batchExecute(input: BatchAssignInput): Promise<number> {
    const { studentIds, rombelId } = input;

    if (!studentIds.length) {
      throw new Error("Student IDs are required");
    }

    if (!rombelId) {
      throw new Error("Rombel ID is required");
    }

    return this.studentRepo.batchAssignToRombel(studentIds, rombelId);
  }
}
