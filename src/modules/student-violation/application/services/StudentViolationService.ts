// Files: src/modules/student-violation/application/services/StudentViolationService.ts

import {BaseAppServices} from "@/modules/shared/core/BaseAppServices"

import {StudentViolationInterface} from "@/modules/student-violation/domain/interfaces/StudentViolationInterface"

import {StudentCompositeInterface} from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface"

import {RecordViolationDTO} from "@/modules/student-violation/domain/dto/RecordViolationDTO"

import {ResolveViolationDTO} from "@/modules/student-violation/domain/dto/ResolveViolationDTO"

import {RecordViolationUseCase} from "@/modules/student-violation/application/usecases/RecordViolationUseCase"

import {ResolveViolationUseCase} from "@/modules/student-violation/application/usecases/ResolveViolationUseCase"

import {ListStudentViolationUseCase} from "@/modules/student-violation/application/usecases/ListStudentViolationUseCase"

import {GetViolationHistoryUseCase} from "@/modules/student-violation/application/usecases/GetViolationHistoryUseCase"

/**
 * ============================================================
 * STUDENT VIOLATION SERVICE
 * ============================================================
 *
 * Application service responsible for orchestrating
 * student violation-related use cases.
 *
 * Responsibilities:
 * - delegate execution to use cases
 * - provide a simple API for controllers
 * - keep controllers thin
 *
 * Business rules must remain inside UseCases.
 */
export class StudentViolationService extends BaseAppServices {

    private readonly recordUC: RecordViolationUseCase
    private readonly resolveUC: ResolveViolationUseCase
    private readonly listUC: ListStudentViolationUseCase
    private readonly historyUC: GetViolationHistoryUseCase

    constructor(
        repo: StudentViolationInterface,
        compositeRepo: StudentCompositeInterface
    ) {

        super()

        this.recordUC = new RecordViolationUseCase(repo, compositeRepo)

        this.resolveUC = new ResolveViolationUseCase(repo)

        this.listUC = new ListStudentViolationUseCase(repo)

        this.historyUC = new GetViolationHistoryUseCase(repo, compositeRepo)

    }

    /**
     * Record student violation
     */
    record = (dto: RecordViolationDTO) =>
        this.execute(this.recordUC, dto)

    /**
     * Resolve or update violation status
     */
    resolve = (dto: ResolveViolationDTO) =>
        this.execute(this.resolveUC, dto)

    /**
     * List violations belonging to a student
     */
    listByStudent = (studentId: string) =>
        this.execute(this.listUC, studentId)

    /**
     * Retrieve violation history by academic year
     */
    async historyByAcademicYear(
        studentId: string,
        academicYearId: string
    ) {

        return this.historyUC.execute({
            studentId,
            academicYearId
        })

    }

}