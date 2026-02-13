//Files: src/modules/academic-year/application/services/AcademicYearService.ts

import type { Result } from "@/modules/shared/core/Result";

import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";
import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";

import { ListAcademicYearUseCase } from "@/modules/academic-year/application/usecases/ListAcademicYearUseCase";
import { GetAcademicYearByIdUseCase } from "@/modules/academic-year/application/usecases/GetAcademicYearByIdUseCase";
import { CreateAcademicYearUseCase } from "@/modules/academic-year/application/usecases/CreateAcademicYearUseCase";
import { UpdateAcademicYearUseCase } from "@/modules/academic-year/application/usecases/UpdateAcademicYearUseCase";
import { SetActiveAcademicYearUseCase } from "@/modules/academic-year/application/usecases/SetActiveAcademicYearUseCase";
import { DeleteAcademicYearUseCase } from "@/modules/academic-year/application/usecases/DeleteAcademicYearUseCase";

/**
 * AcademicYearService
 * -------------------
 * Aggregator untuk seluruh AcademicYear usecases
 */
export class AcademicYearService {
    private readonly listUseCase: ListAcademicYearUseCase;
    private readonly getByIdUseCase: GetAcademicYearByIdUseCase;
    private readonly createUseCase: CreateAcademicYearUseCase;
    private readonly updateUseCase: UpdateAcademicYearUseCase;
    private readonly setActiveUseCase: SetActiveAcademicYearUseCase;
    private readonly deleteUseCase: DeleteAcademicYearUseCase;

    constructor(
        private readonly repo: AcademicYearInterface,
    ) {
        this.listUseCase = new ListAcademicYearUseCase(repo);
        this.getByIdUseCase = new GetAcademicYearByIdUseCase(repo);
        this.createUseCase = new CreateAcademicYearUseCase(repo);
        this.updateUseCase = new UpdateAcademicYearUseCase(repo);
        this.setActiveUseCase = new SetActiveAcademicYearUseCase(repo);
        this.deleteUseCase = new DeleteAcademicYearUseCase(repo);
    }

    /**
     * =========================
     * LIST
     * =========================
     */
    async getAll(): Promise<Result<AcademicYear[]>> {
        return this.listUseCase.execute();
    }

    /**
     * =========================
     * GET BY ID
     * =========================
     */
    async getById(
        id: string,
    ): Promise<Result<AcademicYear>> {
        return this.getByIdUseCase.execute(id);
    }

    /**
     * =========================
     * CREATE
     * =========================
     */
    async create(
        dto: CreateAcademicYearDTO,
    ): Promise<Result<AcademicYear>> {
        return this.createUseCase.execute(dto);
    }

    /**
     * =========================
     * UPDATE
     * =========================
     */
    async update(
        dto: UpdateAcademicYearDTO,
    ): Promise<Result<AcademicYear>> {
        return this.updateUseCase.execute(dto);
    }

    /**
     * =========================
     * SET ACTIVE
     * =========================
     */
    async setActive(
        id: string,
    ): Promise<Result<void>> {
        return this.setActiveUseCase.execute(id);
    }

    /**
     * =========================
     * DELETE
     * =========================
     */
    async delete(
        id: string,
    ): Promise<Result<void>> {
        return this.deleteUseCase.execute(id);
    }
}
