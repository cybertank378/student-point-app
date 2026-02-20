//Files: src/modules/teacher/application/services/TeacherService.ts

import type { Result } from "@/modules/shared/core/Result";

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import type { AssignTeacherRoleDTO } from "@/modules/teacher/domain/dto/AssignTeacherRoleDTO";
import type { AssignHomeroomDTO } from "@/modules/teacher/domain/dto/AssignHomeroomDTO";
import type { ImportRows } from "@/modules/teacher/application/usecase/ImportTeacherUseCase";

import { ListTeacherUseCase } from "../usecase/ListTeacherUseCase";
import { GetTeacherByIdUseCase } from "../usecase/GetTeacherByIdUseCase";
import { CreateTeacherUseCase } from "../usecase/CreateTeacherUseCase";
import { UpdateTeacherUseCase } from "../usecase/UpdateTeacherUseCase";
import { DeleteTeacherUseCase } from "../usecase/DeleteTeacherUseCase";
import { AssignTeacherRoleUseCase } from "../usecase/AssignTeacherRoleUseCase";
import { AssignHomeroomUseCase } from "../usecase/AssignHomeroomUseCase";
import { SearchTeacherUseCase } from "../usecase/SearchTeacherUseCase";
import { ImportTeacherUseCase } from "../usecase/ImportTeacherUseCase";
import { ExportTeacherUseCase } from "../usecase/ExportTeacherUseCase";
import {
    UploadTeacherImageRequest,
    UploadTeacherImageUseCase
} from "@/modules/teacher/application/usecase/UploadTeacherImageUseCase";
import {FileStorageInterface} from "@/libs/FileStorageInterface";
import {UploadUserImageRequest} from "@/modules/user/application/usecase/UploadUserImageUseCase";

/**
 * ============================================================
 * TEACHER SERVICE
 * ============================================================
 *
 * Application Facade untuk modul Teacher.
 *
 * Tanggung Jawab:
 * - Menjadi entry point seluruh operasi Teacher.
 * - Menginisialisasi seluruh UseCase terkait Teacher.
 * - Mendelegasikan eksekusi ke masing-masing UseCase.
 *
 * Bukan Tanggung Jawab:
 * - Tidak mengandung business logic.
 * - Tidak berinteraksi langsung dengan Prisma.
 * - Tidak melakukan validasi domain.
 *
 * Arsitektur:
 * Controller → TeacherService → UseCase → Repository → Prisma
 */
export class TeacherService {

    /**
     * UseCase Instances
     * ------------------------------------------------------------
     * Disimpan sebagai properti private agar:
     * - Tidak dapat diakses dari luar
     * - Tidak dapat dimodifikasi setelah inisialisasi
     */
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
     * ------------------------------------------------------------
     * Menggunakan dependency injection pada level repository.
     *
     * @param repo - Implementasi TeacherInterface (biasanya TeacherRepository)
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
        this.uploadTeacherImageUC = new UploadTeacherImageUseCase(repo, fileRepo)
    }

    /* ==========================================================
       QUERY METHODS (READ OPERATIONS)
       ========================================================== */

    /**
     * Mengambil daftar guru dengan pagination.
     */
    getAll(params: Parameters<ListTeacherUseCase["execute"]>[0]) {
        return this.listUC.execute(params);
    }

    /**
     * Mengambil detail guru berdasarkan ID.
     */
    getById(id: string): Promise<Result<Teacher>> {
        return this.getUC.execute(id);
    }

    /**
     * Melakukan pencarian guru dengan filter lanjutan.
     */
    search(params: Parameters<SearchTeacherUseCase["execute"]>[0]) {
        return this.searchUC.execute(params);
    }

    /**
     * Mengambil seluruh data guru untuk keperluan export.
     */
    export() {
        return this.exportUC.execute();
    }

    /* ==========================================================
       COMMAND METHODS (WRITE OPERATIONS)
       ========================================================== */

    /**
     * Membuat data guru baru.
     */
    create(dto: CreateTeacherDTO) {
        return this.createUC.execute(dto);
    }

    /**
     * Memperbarui data guru.
     */
    update(dto: UpdateTeacherDTO) {
        return this.updateUC.execute(dto);
    }

    /**
     * Menghapus data guru berdasarkan ID.
     */
    delete(id: string) {
        return this.deleteUC.execute(id);
    }

    /**
     * Menetapkan atau memperbarui role guru.
     */
    assignRole(dto: AssignTeacherRoleDTO) {
        return this.assignRoleUC.execute(dto);
    }

    /**
     * Menetapkan guru sebagai wali kelas.
     */
    assignHomeroom(dto: AssignHomeroomDTO) {
        return this.assignHomeroomUC.execute(dto);
    }

    /**
     * Import data guru secara massal.
     */
    import(rows: ImportRows): Promise<Result<string>> {
        return this.importUC.execute(rows);
    }

    uploadTeacherImage(
        request: UploadTeacherImageRequest
    ): Promise<Result<{ fileName: string }>> {
        return this.uploadTeacherImageUC.execute(request);
    }
}

