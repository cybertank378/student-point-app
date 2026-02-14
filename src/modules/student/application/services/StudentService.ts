//Files: src/modules/student/application/services/StudentService.ts
import type { Result } from "@/modules/shared/core/Result";

import type { Student } from "@/modules/student/domain/entity/Student";
import type { CreateStudentDTO } from "@/modules/student/domain/dto/CreateStudentDTO";
import type { UpdateStudentDTO } from "@/modules/student/domain/dto/UpdateStudentDTO";
import type { StudentQueryDTO } from "@/modules/student/domain/dto/StudentQueryDTO";

import { ListStudentUseCase } from "@/modules/student/application/usecases/ListStudentUseCase";
import { GetStudentByIdUseCase } from "@/modules/student/application/usecases/GetStudentByIdUseCase";
import { BatchAssignStudentToRombelUseCase } from "@/modules/student/application/usecases/BatchAssignStudentToRombelUseCase";
import { AssignStudentToRombelUseCase } from "@/modules/student/application/usecases/AssignStudentToRombelUseCase";
import { DeleteStudentUseCase } from "@/modules/student/application/usecases/DeleteStudentUseCase";
import { UpdateStudentUseCase } from "@/modules/student/application/usecases/UpdateStudentUseCase";
import { CreateStudentUseCase } from "@/modules/student/application/usecases/CreateStudentUseCase";
import { GetStudentByNisUseCase } from "@/modules/student/application/usecases/GetStudentByNisUseCase";
import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";
import {
    AssignStudentAcademicYearUsecase
} from "@/modules/student/application/usecases/AssignStudentAcademicYearUseCase";

/**
 * StudentService
 * --------------
 * Aggregator seluruh usecase Student
 */
export class StudentService {
    private readonly listUseCase: ListStudentUseCase;
    private readonly getByIdUseCase: GetStudentByIdUseCase;
    private readonly getByNisUseCase: GetStudentByNisUseCase;
    private readonly createUseCase: CreateStudentUseCase;
    private readonly updateUseCase: UpdateStudentUseCase;
    private readonly deleteUseCase: DeleteStudentUseCase;
    private readonly assignRombelUseCase: AssignStudentToRombelUseCase;
    private readonly batchAssignRombelUseCase: BatchAssignStudentToRombelUseCase;

    /* 🔥 Tambahkan */
    private readonly assignAcademicYearUseCase: AssignStudentAcademicYearUsecase;

    constructor(
        repo: StudentInterface,
        academicYearRepo: AcademicYearInterface,
    ) {
        this.listUseCase = new ListStudentUseCase(repo);
        this.getByIdUseCase = new GetStudentByIdUseCase(repo);
        this.getByNisUseCase = new GetStudentByNisUseCase(repo);
        this.createUseCase = new CreateStudentUseCase(repo, academicYearRepo);
        this.updateUseCase = new UpdateStudentUseCase(repo);
        this.deleteUseCase = new DeleteStudentUseCase(repo);
        this.assignRombelUseCase = new AssignStudentToRombelUseCase(repo);
        this.batchAssignRombelUseCase =
            new BatchAssignStudentToRombelUseCase(repo);

        /* 🔥 Inisialisasi */
        this.assignAcademicYearUseCase =
            new AssignStudentAcademicYearUsecase(repo);
    }

    /* =========================
       LIST
    ========================= */

    async getAll(query?: StudentQueryDTO): Promise<Result<Student[]>> {
        return this.listUseCase.execute(query);
    }

    /* =========================
       GET BY ID
    ========================= */

    async getById(id: string): Promise<Result<Student>> {
        return this.getByIdUseCase.execute(id);
    }

    /* =========================
       GET BY NIS
    ========================= */

    async getByNis(nis: number): Promise<Result<Student>> {
        return this.getByNisUseCase.execute(nis);
    }

    /* =========================
       CREATE
    ========================= */

    async create(dto: CreateStudentDTO): Promise<Result<Student>> {
        return this.createUseCase.execute(dto);
    }

    /* =========================
       UPDATE
    ========================= */

    async update(dto: UpdateStudentDTO): Promise<Result<Student>> {
        return this.updateUseCase.execute(dto);
    }

    /* =========================
       DELETE (SOFT)
    ========================= */

    async delete(id: string): Promise<Result<void>> {
        return this.deleteUseCase.execute(id);
    }

    /* =========================
       ASSIGN ROMBEL
    ========================= */

    async assignToRombel(
        studentId: string,
        rombelId: string,
    ): Promise<Result<void>> {
        return this.assignRombelUseCase.execute({
            studentId,
            rombelId,
        });
    }

    /* =========================
       BATCH ASSIGN ROMBEL
    ========================= */

    async batchAssignToRombel(
        studentIds: string[],
        rombelId: string,
    ): Promise<Result<number>> {
        return this.batchAssignRombelUseCase.execute({
            studentIds,
            rombelId,
        });
    }

    /* =========================
       ASSIGN ACADEMIC YEAR (NEW)
    ========================= */

    async assignAcademicYear(
        studentId: string,
        rombelId: string,
    ): Promise<Student> {
        return this.assignAcademicYearUseCase.execute({
            studentId,
            rombelId,
        });
    }

    /* =========================
       BATCH ASSIGN ACADEMIC YEAR (NEW)
    ========================= */

    async batchAssignAcademicYear(
        studentIds: string[],
        rombelId: string,
    ): Promise<number> {
        return this.assignAcademicYearUseCase.batchExecute({
            studentIds,
            rombelId,
        });
    }
}
