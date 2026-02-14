//Files: src/modules/religion/application/usecase/GetReligionByIdUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import type { Religion } from "@/modules/religion/domain/entity/Religion";
import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";

export class GetReligionByIdUseCase {
  constructor(private readonly repo: ReligionInterface) {}

  async execute(id: string): Promise<Result<Religion>> {
    const religion = await this.repo.findById(id);

    if (!religion) {
      return Result.fail("ID Agama tidak ditemukan");
    }

    return Result.ok(religion);
  }
}
