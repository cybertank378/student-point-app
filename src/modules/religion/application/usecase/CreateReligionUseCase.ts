//Files: src/modules/religion/application/usecase/CreateReligionUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";

import type { CreateReligionDTO } from "@/modules/religion/domain/dto/CreateReligionDTO";
import type { Religion } from "@/modules/religion/domain/entity/Religion";
import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";

/**
 * ============================================================
 * CREATE RELIGION USE CASE
 * ============================================================
 *
 * Purpose:
 * - Create a new Religion entity.
 *
 * Business Rules:
 * - Religion code must be unique.
 *
 * Architecture:
 * - Extends BaseUseCase (standardized Result handling)
 * - Uses AppError for structured error handling
 * - No manual Result wrapping
 */
export class CreateReligionUseCase extends BaseUseCase<
    CreateReligionDTO,
    Religion
> {
    constructor(private readonly repo: ReligionInterface) {
        super();
    }

    protected async handle(dto: CreateReligionDTO): Promise<Religion> {
        const exists = await this.repo.findByCode(dto.kode);

        if (exists) {
            throw AppError.conflict("Kode agama sudah terdaftar");
        }

        return this.repo.create(dto);
    }
}