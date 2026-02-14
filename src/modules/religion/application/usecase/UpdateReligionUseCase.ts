//Files: src/modules/religion/application/usecase/UpdateReligionUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { Religion } from "@/modules/religion/domain/entity/Religion";
import type { UpdateReligionDTO } from "@/modules/religion/domain/dto/UpdateReligionDTO";
import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";

export class UpdateReligionUseCase {
  constructor(private readonly repo: ReligionInterface) {}

  async execute(dto: UpdateReligionDTO): Promise<Result<Religion>> {
    const existing = await this.repo.findById(dto.id);
    if (!existing) {
      return Result.fail("ID Agama tidak ditemukan");
    }

    const byCode = await this.repo.findByCode(dto.kode);
    if (byCode && byCode.id !== dto.id) {
      return Result.fail("Kode agama sudah digunakan");
    }

    const updated = await this.repo.update(dto);
    return Result.ok(updated);
  }
}
