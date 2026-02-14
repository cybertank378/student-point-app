//Files: src/modules/violation/application/usecases/GetViolationByIdUseCase.ts

import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import type { Violation } from "@/modules/violation/domain/entity/Violation";
import { Result } from "@/modules/shared/core/Result";

export class GetViolationByIdUseCase {
  constructor(private repo: ViolationInterface) {}

  async execute(id: string): Promise<Result<Violation>> {
    const violation = await this.repo.findById(id);
    if (!violation) return Result.fail("Violation not found");
    return Result.ok(violation);
  }
}
