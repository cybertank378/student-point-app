//Files: src/modules/student-counseling/application/usecases/CloseStudentCounselingCaseUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"
import { AppError } from "@/modules/shared/errors/AppError"

import { CaseStatus } from "@/libs/utils/enums"

import {
    StudentCounselingCase
} from "@/modules/student-counseling/domain/entity/StudentCounselingCase"

import {
    StudentCounselingCaseInterface
} from "@/modules/student-counseling/domain/interfaces/StudentCounselingCaseInterface"

/**
 * ============================================================
 * CLOSE STUDENT COUNSELING CASE USE CASE
 * ============================================================
 *
 * UseCase untuk menutup kasus konseling siswa.
 *
 * Business Rules
 * - caseId wajib ada
 * - kasus harus ditemukan
 * - kasus tidak boleh sudah CLOSED
 */

export class CloseCounselingCaseUseCase
    extends BaseUseCase<{ caseId: string }, StudentCounselingCase> {

    constructor(
        private readonly repo: StudentCounselingCaseInterface
    ) {
        super()
    }

    protected async handle(
        request: { caseId: string }
    ): Promise<StudentCounselingCase> {

        const { caseId } = request

        const entity = await this.repo.findById(caseId)

        if (!entity) {
            throw AppError.notFound("Kasus konseling tidak ditemukan")
        }

        if (entity.status === CaseStatus.CLOSED) {
            throw AppError.validation("Kasus sudah ditutup")
        }

        const closed =
            new StudentCounselingCase({
                ...entity,
                status: CaseStatus.CLOSED,
                closedAt: new Date()
            })

        return this.repo.update(closed)

    }

}