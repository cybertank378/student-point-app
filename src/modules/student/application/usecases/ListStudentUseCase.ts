//Files: src/modules/student/application/usecases/ListStudentUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { Student } from "@/modules/student/domain/entity/Student";
import type { StudentQueryDTO } from "@/modules/student/domain/dto/StudentQueryDTO";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

export class ListStudentUseCase {
  constructor(private readonly repo: StudentInterface) {}

  async execute(query?: StudentQueryDTO): Promise<Result<Student[]>> {
    const students = await this.repo.findAll(query);
    return Result.ok(students);
  }
}
