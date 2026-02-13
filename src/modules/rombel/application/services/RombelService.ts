//Files: src/modules/rombel/application/services/RombelService.ts

import type { Result } from "@/modules/shared/core/Result";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";

import { ListRombelUseCase } from "@/modules/rombel/application/usecases/ListRombelUseCase";
import { GetRombelByIdUseCase } from "@/modules/rombel/application/usecases/GetRombelByIdUseCase";
import { CreateRombelUseCase } from "@/modules/rombel/application/usecases/CreateRombelUseCase";
import { UpdateRombelUseCase } from "@/modules/rombel/application/usecases/UpdateRombelUseCase";
import { DeleteRombelUseCase } from "@/modules/rombel/application/usecases/DeleteRombelUseCase";

/**
 * RombelService
 * -------------
 * Aggregator seluruh usecase Rombel
 */
export class RombelService {
    private readonly listUseCase: ListRombelUseCase;
    private readonly getByIdUseCase: GetRombelByIdUseCase;
    private readonly createUseCase: CreateRombelUseCase;
    private readonly updateUseCase: UpdateRombelUseCase;
    private readonly deleteUseCase: DeleteRombelUseCase;

    constructor(
        private readonly repo: RombelInterface,
    ) {
        this.listUseCase = new ListRombelUseCase(repo);
        this.getByIdUseCase = new GetRombelByIdUseCase(repo);
        this.createUseCase = new CreateRombelUseCase(repo);
        this.updateUseCase = new UpdateRombelUseCase(repo);
        this.deleteUseCase = new DeleteRombelUseCase(repo);
    }

    /**
     * =========================
     * LIST
     * =========================
     */
    async getAll(): Promise<Result<Rombel[]>> {
        return this.listUseCase.execute();
    }

    /**
     * =========================
     * GET BY ID
     * =========================
     */
    async getById(id: string): Promise<Result<Rombel>> {
        return this.getByIdUseCase.execute(id);
    }

    /**
     * =========================
     * CREATE
     * =========================
     */
    async create(
        dto: CreateRombelDTO,
    ): Promise<Result<Rombel>> {
        return this.createUseCase.execute(dto);
    }

    /**
     * =========================
     * UPDATE
     * =========================
     */
    async update(
        dto: UpdateRombelDTO,
    ): Promise<Result<Rombel>> {
        return this.updateUseCase.execute(dto);
    }

    /**
     * =========================
     * DELETE
     * =========================
     */
    async delete(id: string): Promise<Result<void>> {
        return this.deleteUseCase.execute(id);
    }
}
