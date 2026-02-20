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
import { AssignStudentAcademicYearUseCase } from "@/modules/student/application/usecases/AssignStudentAcademicYearUseCase";

import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";
import {
    BatchAssignStudentAcademicYearUseCase
} from "@/modules/student/application/usecases/BatchAssignStudentAcademicYearUseCase";

/**
 * ============================================================
 * STUDENT SERVICE
 * ============================================================
 *
 * Aggregator seluruh Student usecase.
 * Semua method return Result<T>.
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
    private readonly assignAcademicYearUseCase: AssignStudentAcademicYearUseCase;
    private readonly batchAssignAcademicYearUseCase: BatchAssignStudentAcademicYearUseCase;

    constructor(
        repo: StudentInterface,
        academicYearRepo: AcademicYearInterface
    ) {
        this.listUseCase = new ListStudentUseCase(repo);
        this.getByIdUseCase = new GetStudentByIdUseCase(repo);
        this.getByNisUseCase = new GetStudentByNisUseCase(repo);
        this.createUseCase = new CreateStudentUseCase(
            repo,
            academicYearRepo
        );
        this.updateUseCase = new UpdateStudentUseCase(repo);
        this.deleteUseCase = new DeleteStudentUseCase(repo);
        this.assignRombelUseCase = new AssignStudentToRombelUseCase(repo);
        this.batchAssignRombelUseCase =new BatchAssignStudentToRombelUseCase(repo);
        this.assignAcademicYearUseCase = new AssignStudentAcademicYearUseCase(repo);
        this.batchAssignAcademicYearUseCase = new BatchAssignStudentAcademicYearUseCase(repo);
    }

    /* =========================
       LIST
    ========================= */

    getAll(
        query?: StudentQueryDTO
    ): Promise<Result<Student[]>> {
        return this.listUseCase.execute(query);
    }

    /* =========================
       GET BY ID
    ========================= */

    getById(id: string): Promise<Result<Student>> {
        return this.getByIdUseCase.execute(id);
    }

    /* =========================
       GET BY NIS
    ========================= */

    getByNis(nis: number): Promise<Result<Student>> {
        return this.getByNisUseCase.execute(nis);
    }

    /* =========================
       CREATE
    ========================= */

    create(
        dto: CreateStudentDTO
    ): Promise<Result<Student>> {
        return this.createUseCase.execute(dto);
    }

    /* =========================
       UPDATE
    ========================= */

    update(
        dto: UpdateStudentDTO
    ): Promise<Result<Student>> {
        return this.updateUseCase.execute(dto);
    }

    /* =========================
       DELETE
    ========================= */

    delete(id: string): Promise<Result<void>> {
        return this.deleteUseCase.execute(id);
    }

    /* =========================
       ASSIGN ROMBEL
    ========================= */

    assignToRombel(
        dto: { studentId: string; rombelId: string }
    ): Promise<Result<void>> {
        return this.assignRombelUseCase.execute(dto);
    }

    /* =========================
       BATCH ASSIGN ROMBEL
    ========================= */

    batchAssignToRombel(
        dto: { studentIds: string[]; rombelId: string }
    ): Promise<Result<number>> {
        return this.batchAssignRombelUseCase.execute(dto);
    }

    /* =========================
       ASSIGN ACADEMIC YEAR
    ========================= */
    assignAcademicYear(
        dto: { studentId: string; rombelId: string }
    ): Promise<Result<Student>> {
        return this.assignAcademicYearUseCase.execute(dto);
    }

    /* =========================
       BATCH ASSIGN ACADEMIC YEAR
    ========================= */
    batchAssignAcademicYear(
        dto: { studentIds: string[]; rombelId: string }
    ): Promise<Result<number>> {
        return this.batchAssignAcademicYearUseCase.execute(dto);
    }
}