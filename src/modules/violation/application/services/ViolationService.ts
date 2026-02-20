// Files: src/modules/violation/application/services/ViolationService.ts

import type { Result } from "@/modules/shared/core/Result";
import type {
    BasePaginationParams,
    BasePaginationResponse,
} from "@/modules/shared/http/pagination/BasePagination";

import type { Violation } from "@/modules/violation/domain/entity/Violation";
import type { ViolationInterface } from "@/modules/violation/domain/interfaces/ViolationInterface";
import type { CreateViolationDTO } from "@/modules/violation/domain/dto/CreateViolationDTO";
import type { UpdateViolationDTO } from "@/modules/violation/domain/dto/UpdateViolationDTO";

import { CreateViolationUseCase } from "@/modules/violation/application/usecases/CreateViolationUseCase";
import { UpdateViolationUseCase } from "@/modules/violation/application/usecases/UpdateViolationUseCase";
import { DeleteViolationUseCase } from "@/modules/violation/application/usecases/DeleteViolationUseCase";
import { GetViolationByIdUseCase } from "@/modules/violation/application/usecases/GetViolationByIdUseCase";
import { ListViolationUseCase } from "@/modules/violation/application/usecases/ListViolationUseCase";

/**
 * ============================================================
 * VIOLATION SERVICE
 * ============================================================
 *
 * Application Service Layer for Violation module.
 *
 * Responsibilities:
 * - Orchestrate violation use cases
 * - Expose clean API for controllers
 *
 * This class does NOT:
 * - Contain business logic
 * - Know about HTTP
 * - Know about Prisma
 *
 * Transaction boundary should live in repository layer.
 * ============================================================
 */
export class ViolationService {
    private readonly createUseCase: CreateViolationUseCase;
    private readonly updateUseCase: UpdateViolationUseCase;
    private readonly deleteUseCase: DeleteViolationUseCase;
    private readonly getByIdUseCase: GetViolationByIdUseCase;
    private readonly listUseCase: ListViolationUseCase;

    constructor(private readonly repository: ViolationInterface) {
        this.createUseCase = new CreateViolationUseCase(repository);
        this.updateUseCase = new UpdateViolationUseCase(repository);
        this.deleteUseCase = new DeleteViolationUseCase(repository);
        this.getByIdUseCase = new GetViolationByIdUseCase(repository);
        this.listUseCase = new ListViolationUseCase(repository);
    }

    /* =========================================================
       WRITE OPERATIONS
    ========================================================= */

    create(dto: CreateViolationDTO): Promise<Result<Violation>> {
        return this.createUseCase.execute(dto);
    }

    update(dto: UpdateViolationDTO): Promise<Result<Violation>> {
        return this.updateUseCase.execute(dto);
    }

    delete(id: string): Promise<Result<void>> {
        return this.deleteUseCase.execute(id);
    }

    /* =========================================================
       READ OPERATIONS
    ========================================================= */

    findById(id: string): Promise<Result<Violation>> {
        return this.getByIdUseCase.execute(id);
    }

    list(
        params: BasePaginationParams,
    ): Promise<Result<BasePaginationResponse<Violation>>> {
        return this.listUseCase.execute(params);
    }
}