//Files: src/modules/teacher/application/services/TeacherService.ts

import type { Result } from "@/modules/shared/core/Result";

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import type { AssignTeacherRoleDTO } from "@/modules/teacher/domain/dto/AssignTeacherRoleDTO";
import type { AssignHomeroomDTO } from "@/modules/teacher/domain/dto/AssignHomeroomDTO";
import type { ImportRows } from "@/modules/teacher/application/usecase/ImportTeacherUseCase";

import { ListTeacherUseCase } from "@/modules/teacher/application/usecase/ListTeacherUseCase";
import { GetTeacherByIdUseCase } from "@/modules/teacher/application/usecase/GetTeacherByIdUseCase";
import { CreateTeacherUseCase } from "@/modules/teacher/application/usecase/CreateTeacherUseCase";
import { UpdateTeacherUseCase } from "@/modules/teacher/application/usecase/UpdateTeacherUseCase";
import { DeleteTeacherUseCase } from "@/modules/teacher/application/usecase/DeleteTeacherUseCase";
import { AssignTeacherRoleUseCase } from "@/modules/teacher/application/usecase/AssignTeacherRoleUseCase";
import { AssignHomeroomUseCase } from "@/modules/teacher/application/usecase/AssignHomeroomUseCase";
import { SearchTeacherUseCase } from "@/modules/teacher/application/usecase/SearchTeacherUseCase";
import { ImportTeacherUseCase } from "@/modules/teacher/application/usecase/ImportTeacherUseCase";
import { ExportTeacherUseCase } from "@/modules/teacher/application/usecase/ExportTeacherUseCase";
import { UploadTeacherImageRequest, UploadTeacherImageUseCase} from "@/modules/teacher/application/usecase/UploadTeacherImageUseCase";
import {FileStorageInterface} from "@/libs/FileStorageInterface";
/**
 * ============================================================
 * TEACHER SERVICE
 * ============================================================
 *
 * Application Facade for Teacher Module.
 *
 * Responsibilities:
 * - Acts as entry point for controllers
 * - Delegates execution to UseCases
 * - Keeps orchestration centralized
 *
 * Not Responsible For:
 * - Business rules (handled by UseCase)
 * - Persistence logic (handled by Repository)
 * - Validation (handled by Schema)
 *
 * Architecture:
 * Controller → Service → UseCase → Repository → Prisma
 */
export class TeacherService {
    private readonly listUC: ListTeacherUseCase;
    private readonly getUC: GetTeacherByIdUseCase;
    private readonly createUC: CreateTeacherUseCase;
    private readonly updateUC: UpdateTeacherUseCase;
    private readonly deleteUC: DeleteTeacherUseCase;
    private readonly assignRoleUC: AssignTeacherRoleUseCase;
    private readonly assignHomeroomUC: AssignHomeroomUseCase;
    private readonly searchUC: SearchTeacherUseCase;
    private readonly importUC: ImportTeacherUseCase;
    private readonly exportUC: ExportTeacherUseCase;
    private readonly uploadTeacherImageUC: UploadTeacherImageUseCase;

    /**
     * Constructor
     *
     * @param repo - Teacher repository implementation
     * @param fileRepo - File storage implementation
     */
    constructor(
        repo: TeacherInterface,
        fileRepo: FileStorageInterface
    ) {
        this.listUC = new ListTeacherUseCase(repo);
        this.getUC = new GetTeacherByIdUseCase(repo);
        this.createUC = new CreateTeacherUseCase(repo);
        this.updateUC = new UpdateTeacherUseCase(repo);
        this.deleteUC = new DeleteTeacherUseCase(repo);
        this.assignRoleUC = new AssignTeacherRoleUseCase(repo);
        this.assignHomeroomUC = new AssignHomeroomUseCase(repo);
        this.searchUC = new SearchTeacherUseCase(repo);
        this.importUC = new ImportTeacherUseCase(repo);
        this.exportUC = new ExportTeacherUseCase(repo);
        this.uploadTeacherImageUC = new UploadTeacherImageUseCase(
            repo,
            fileRepo
        );
    }

    /* ==========================================================
       QUERY METHODS
       ========================================================== */

    getAll(params: Parameters<ListTeacherUseCase["execute"]>[0]) {
        return this.listUC.execute(params);
    }

    getById(id: string): Promise<Result<Teacher>> {
        return this.getUC.execute(id);
    }

    search(params: Parameters<SearchTeacherUseCase["execute"]>[0]) {
        return this.searchUC.execute(params);
    }

    export(params?: { role?: string }) {
        return this.exportUC.execute(params);
    }

    /* ==========================================================
       COMMAND METHODS
       ========================================================== */

    create(dto: CreateTeacherDTO) {
        return this.createUC.execute(dto);
    }

    update(dto: UpdateTeacherDTO) {
        return this.updateUC.execute(dto);
    }

    delete(id: string) {
        return this.deleteUC.execute(id);
    }

    /**
     * ============================================================
     * BULK ASSIGN ROLE
     * ============================================================
     *
     * Core method for assigning roles.
     * Supports single & bulk automatically.
     */
    assignRoleBulk(dto: AssignTeacherRoleDTO) {
        return this.assignRoleUC.execute(dto);
    }


    /**
     * ============================================================
     * BULK ASSIGN HOMEROOM
     * ============================================================
     */
    assignHomeroomBulk(dto: AssignHomeroomDTO) {
        return this.assignHomeroomUC.execute(dto);
    }


    import(rows: ImportRows) {
        return this.importUC.execute(rows);
    }

    uploadTeacherImage(
        request: UploadTeacherImageRequest
    ): Promise<Result<{ fileName: string }>> {
        return this.uploadTeacherImageUC.execute(request);
    }
}