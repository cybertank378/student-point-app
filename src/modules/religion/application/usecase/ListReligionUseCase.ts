//Files: src/modules/religion/application/usecase/ListReligionUseCase.ts

import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";
import { Result } from "@/modules/shared/core/Result";
import type { Religion } from "@/modules/religion/domain/entity/Religion";

export class ListReligionUseCase {
  constructor(private repo: ReligionInterface) {}
  async execute(): Promise<Result<Religion[]>> {
    return Result.ok(await this.repo.findAll());
  }
}
