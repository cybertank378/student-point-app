//Files: src/modules/rombel/application/usecases/ListRombelUseCase.ts
import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";

import type {Rombel} from "@/modules/rombel/domain/entity/Rombel";
import type {RombelInterface} from "@/modules/rombel/domain/interfaces/RombelInterface";

/**
 * ============================================================
 * LIST ROMBEL USE CASE
 * ============================================================
 *
 * Purpose:
 * - Retrieve all Rombel entities.
 *
 * Architecture:
 * - Extends BaseUseCase
 * - Centralized error handling
 * - Structured logging included
 */
export class ListRombelUseCase extends BaseUseCase<
    void,
    Rombel[]
> {
    constructor(private readonly repo: RombelInterface) {
        super();
    }

    protected async handle(): Promise<Rombel[]> {
        return await this.repo.findAll();
    }
}