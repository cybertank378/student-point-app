//Files: src/modules/student/application/usecases/DeleteStudentUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

export class DeleteStudentUseCase {
  constructor(private readonly repo: StudentInterface) {}

  async execute(id: string): Promise<Result<void>> {
    const student = await this.repo.findById(id);

    if (!student) {
      return Result.fail("Siswa tidak ditemukan");
    }

    await this.repo.softDelete(id);
    return Result.ok(undefined);
  }
}
