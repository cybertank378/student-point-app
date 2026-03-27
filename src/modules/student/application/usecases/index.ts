//Files: src/modules/student/application/usecases/index.ts

/**
 * ============================================================
 * STUDENT USECASE EXPORTS
 * ============================================================
 *
 * Centralized export untuk seluruh Student UseCases.
 *
 * Tujuan:
 * - Single entry point import
 * - Menghindari deep import path
 * - Mempermudah maintainability
 *
 * Usage:
 *
 * import {
 *   CreateStudentUseCase,
 *   UpdateStudentUseCase
 * } from "@/modules/student/application/usecases"
 */

export { CheckStudentNisnExistsUseCase } from "@/modules/student/application/usecases/CheckStudentNisnExistsUseCase";
export { CreateStudentUseCase } from "@/modules/student/application/usecases/CreateStudentUseCase";
export { DeleteStudentUseCase } from "@/modules/student/application/usecases/DeleteStudentUseCase";
export { GetStudentByIdUseCase } from "@/modules/student/application/usecases/GetStudentByIdUseCase";
export { GetStudentByNisUseCase } from "@/modules/student/application/usecases/GetStudentByNisUseCase";
export { GetStudentListUseCase } from "@/modules/student/application/usecases/GetStudentListUseCase";
export { GetStudentStatisticsUseCase } from "@/modules/student/application/usecases/GetStudentStatisticsUseCase";
export { ImportStudentUseCase } from "@/modules/student/application/usecases/ImportStudentUseCase";
export { UpdateStudentUseCase } from "@/modules/student/application/usecases/UpdateStudentUseCase";
export { UploadStudentImageUseCase } from "@/modules/student/application/usecases/UploadStudentImageUseCase";
