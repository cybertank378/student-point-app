//Files: src/modules/religion/application/usecase/DeleteReligionUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";

export class DeleteReligionUseCase {
  constructor(private readonly repo: ReligionInterface) {}

  async execute(id: string): Promise<Result<void>> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      return Result.fail("ID Agama tidak ditemukan");
    }

    await this.repo.delete(id);
    return Result.ok(undefined);
  }
}
