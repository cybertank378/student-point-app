//Files: src/modules/student-counseling/application/usecases/UpdateStudentCounselingCaseUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"
import { AppError } from "@/modules/shared/errors/AppError"

import {
    StudentCounselingCase
} from "@/modules/student-counseling/domain/entity/StudentCounselingCase"

import {
    UpdateStudentCounselingCaseDTO
} from "@/modules/student-counseling/domain/dto/UpdateStudentCounselingCaseDTO"

import {
    StudentCounselingCaseMapper
} from "@/modules/student-counseling/domain/mapper/StudentCounselingCaseMapper"

import {
    StudentCounselingCaseInterface
} from "@/modules/student-counseling/domain/interfaces/StudentCounselingCaseInterface"

/**
 * ============================================================
 * PATCH STUDENT COUNSELING CASE USE CASE
 * ============================================================
 *
 * UseCase untuk melakukan perubahan parsial terhadap
 * kasus konseling siswa.
 *
 * Business Rules
 * - caseId wajib ada
 * - kasus harus ditemukan
 * - reason tidak boleh kosong jika diberikan
 */

export class UpdateCounselingCaseUseCase
    extends BaseUseCase<
        { caseId: string; dto: UpdateStudentCounselingCaseDTO },
        StudentCounselingCase
    > {

    constructor(
        private readonly repo: StudentCounselingCaseInterface
    ) {
        super()
    }

    protected async handle(
        request: { caseId: string; dto: UpdateStudentCounselingCaseDTO }
    ): Promise<StudentCounselingCase> {

        const { caseId, dto } = request

        if (!caseId) {
            throw AppError.validation("CaseId wajib diisi")
        }

        const entity = await this.repo.findById(caseId)

        if (!entity) {
            throw AppError.notFound("Kasus konseling tidak ditemukan")
        }

        const updated =
            StudentCounselingCaseMapper.applyPatch(entity, dto)

        return this.repo.update(updated)

    }

}