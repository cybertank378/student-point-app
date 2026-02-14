//Files: src/modules/student/application/usecases/BatchAssignStudentToRombelUseCase.ts

import type { BatchAssignStudentToRombelDTO } from "@/modules/student/domain/dto/BatchAssignStudentToRombelDTO";
import { Result } from "@/modules/shared/core/Result";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";

export class BatchAssignStudentToRombelUseCase {
  constructor(private readonly repo: StudentInterface) {}

  async execute(dto: BatchAssignStudentToRombelDTO): Promise<Result<number>> {
    const count = await this.repo.batchAssignToRombel(
      dto.studentIds,
      dto.rombelId,
    );

    return Result.ok(count);
  }
}
