// Files: src/modules/student/application/services/StudentService.ts
// Files: src/modules/student/application/services/StudentService.ts

import type { FileStorageInterface } from "@/libs/FileStorageInterface";
import type { Result } from "@/modules/shared/core/Result";
import type { BasePaginationParams, BasePaginationResponse } from "@/modules/shared/http/pagination/BasePagination";
import {
  CheckStudentNisnExistsUseCase,
  CreateStudentUseCase,
  DeleteStudentUseCase,
  GetStudentByIdUseCase,
  GetStudentByNisUseCase,
  GetStudentListUseCase,
  GetStudentStatisticsUseCase,
  ImportStudentUseCase,
  UpdateStudentUseCase,
  UploadStudentImageUseCase,
} from "@/modules/student/application/usecases";

import type { UploadStudentImageRequest } from "@/modules/student/application/usecases/UploadStudentImageUseCase";
import type { StudentIdentityDTO, StudentStatisticDTO } from "@/modules/student/domain/dto";
import type { BulkImportStudentDTO } from "@/modules/student/domain/dto/BulkImportStudentDTO";
import type { CreateStudentDTO } from "@/modules/student/domain/dto/CreateStudentDTO";
import type { DeleteStudentDTO } from "@/modules/student/domain/dto/DeleteStudentDTO";
import type { UpdateStudentDTO } from "@/modules/student/domain/dto/UpdateStudentDTO";
import type { StudentInterface } from "@/modules/student/domain/interfaces/StudentInterface";
import type { StudentCompositeService } from "@/modules/student-composite/application/services/StudentCompositeService";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";
import type { StudentListCompositeDTO } from "@/modules/student-composite/domain/dto/StudentListCompositeDTO";
import {StudentListParams} from "@/modules/student-composite/domain/types/StudentListParams";

/**
 * ============================================================
 * STUDENT SERVICE
 * ============================================================
 *
 * Application Facade for Student Module.
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

export class StudentService {
  private readonly checkNisnUC: CheckStudentNisnExistsUseCase;
  private readonly createUC: CreateStudentUseCase;
  private readonly updateUC: UpdateStudentUseCase;
  private readonly deleteUC: DeleteStudentUseCase;
  private readonly importUC: ImportStudentUseCase;

  private readonly getUC: GetStudentByIdUseCase;
  private readonly getNisUC: GetStudentByNisUseCase;
  private readonly listUC: GetStudentListUseCase;
  private readonly statisticsUC: GetStudentStatisticsUseCase;
  private readonly uploadImageUC: UploadStudentImageUseCase;

  constructor(
      repo: StudentInterface,
      compositeService: StudentCompositeService,
      fileStorage: FileStorageInterface
  ) {
    this.checkNisnUC = new CheckStudentNisnExistsUseCase(repo);
    this.createUC = new CreateStudentUseCase(repo);
    this.updateUC = new UpdateStudentUseCase(repo);
    this.deleteUC = new DeleteStudentUseCase(repo);
    this.importUC = new ImportStudentUseCase(repo);
    this.getUC = new GetStudentByIdUseCase(compositeService);
    this.getNisUC = new GetStudentByNisUseCase(repo, compositeService);
    this.statisticsUC = new GetStudentStatisticsUseCase(repo);
    this.listUC = new GetStudentListUseCase(compositeService);
    this.uploadImageUC = new UploadStudentImageUseCase(repo, fileStorage);
  }

  /* ==========================================================
   QUERY METHODS
   ========================================================== */

  getById(id: string): Promise<Result<StudentCompositeDTO>> {
    return this.getUC.execute(id);
  }

  getByNis(nis: string): Promise<Result<StudentCompositeDTO>> {
    return this.getNisUC.execute(nis);
  }

  getList(params: StudentListParams): Promise<Result<BasePaginationResponse<StudentListCompositeDTO>>> {
    return this.listUC.execute(params);
  }

  checkNisnExists(nisn: string): Promise<Result<boolean>> {
    return this.checkNisnUC.execute(nisn);
  }
  /**
   * ==========================================================
   * STUDENT STATISTICS
   * ==========================================================
   */

  getStatistics(): Promise<Result<StudentStatisticDTO>> {
    return this.statisticsUC.execute();
  }

  /* ==========================================================
   COMMAND METHODS
   ========================================================== */

  create(dto: CreateStudentDTO): Promise<Result<StudentIdentityDTO>> {
    return this.createUC.execute(dto);
  }

  update(dto: UpdateStudentDTO): Promise<Result<StudentIdentityDTO>> {
    return this.updateUC.execute(dto);
  }

  delete(dto: DeleteStudentDTO): Promise<Result<void>> {
    return this.deleteUC.execute(dto);
  }

  import(rows: BulkImportStudentDTO[]): Promise<Result<number>> {
    return this.importUC.execute(rows);
  }

  uploadStudentImage(request: UploadStudentImageRequest): Promise<Result<{ fileName: string }>> {
    return this.uploadImageUC.execute(request);
  }
}
