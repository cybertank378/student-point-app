//Files: src/modules/religion/application/usecase/UpdateReligionUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { Religion } from "@/modules/religion/domain/entity/Religion";
import type { UpdateReligionDTO } from "@/modules/religion/domain/dto/UpdateReligionDTO";
import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";

/**
 * ============================================================
 * UPDATE RELIGION USE CASE
 * ============================================================
 *
 * Purpose:
 * - Update existing Religion entity.
 *
 * Business Rules:
 * - Religion must exist.
 * - Religion code must remain unique.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class UpdateReligionUseCase extends BaseUseCase<
    UpdateReligionDTO,
    Religion
> {
    constructor(private readonly repo: ReligionInterface) {
        super();
    }

    protected async handle(dto: UpdateReligionDTO): Promise<Religion> {
        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            throw AppError.notFound("ID Agama tidak ditemukan");
        }

        const byCode = await this.repo.findByCode(dto.kode);

        if (byCode && byCode.id !== dto.id) {
            throw AppError.conflict("Kode agama sudah digunakan");
        }

        return this.repo.update(dto);
    }
}