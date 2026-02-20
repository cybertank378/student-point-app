//Files: src/modules/religion/application/usecase/ListReligionUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { Religion } from "@/modules/religion/domain/entity/Religion";
import type { ReligionInterface } from "@/modules/religion/domain/interfaces/ReligionInterface";

/**
 * ============================================================
 * LIST RELIGION USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve all Religion entities.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - No manual Result wrapping
 * - Errors handled centrally
 */
export class ListReligionUseCase extends BaseUseCase<
    void,
    Religion[]
> {
    constructor(private readonly repo: ReligionInterface) {
        super();
    }

    protected async handle(): Promise<Religion[]> {
        return this.repo.findAll();
    }
}