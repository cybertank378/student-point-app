//Files: src/modules/student/application/usecases/GetStudentByIdUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { Student } from "@/modules/student/domain/entity/Student";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

export class GetStudentByIdUseCase {
  constructor(private readonly repo: StudentInterface) {}

  async execute(id: string): Promise<Result<Student>> {
    const student = await this.repo.findById(id);

    if (!student) {
      return Result.fail("Student tidak ditemukan");
    }

    return Result.ok(student);
  }
}
