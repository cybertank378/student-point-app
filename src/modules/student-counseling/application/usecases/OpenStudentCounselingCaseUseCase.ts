//Files: src/modules/student-counseling/application/usecases/OpenStudentCounselingCaseUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase"
import { AppError } from "@/modules/shared/errors/AppError"

import {
    StudentCounselingCase
} from "@/modules/student-counseling/domain/entity/StudentCounselingCase"

import {
    StudentCounselingCaseInterface
} from "@/modules/student-counseling/domain/interfaces/StudentCounselingCaseInterface"

import {
    StudentCounselingCaseMapper
} from "@/modules/student-counseling/domain/mapper/StudentCounselingCaseMapper"

import {
    OpenStudentCounselingCaseDTO
} from "@/modules/student-counseling/domain/dto/OpenStudentCounselingCaseDTO"

import {
    StudentCompositeInterface
} from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface"

/**
 * ============================================================
 * OPEN STUDENT COUNSELING CASE USE CASE
 * ============================================================
 *
 * UseCase untuk membuka kasus konseling baru bagi seorang siswa.
 *
 * Business Rules
 * - studentId wajib ada
 * - student harus ada di sistem
 * - academicYearId wajib ada
 * - reason tidak boleh kosong
 */

export class OpenStudentCounselingCaseUseCase
    extends BaseUseCase<
        { studentId: string; dto: OpenStudentCounselingCaseDTO },
        StudentCounselingCase
    > {

    constructor(
        private readonly repo: StudentCounselingCaseInterface,
        private readonly composite: StudentCompositeInterface
    ) {
        super()
    }

    protected async handle(
        request: { studentId: string; dto: OpenStudentCounselingCaseDTO }
    ): Promise<StudentCounselingCase> {

        const { studentId, dto } = request

        /**
         * ========================================================
         * VALIDASI INPUT
         * ========================================================
         */

        if (!studentId) {
            throw AppError.validation(
                "StudentId wajib diisi"
            )
        }

        /**
         * ========================================================
         * VALIDASI STUDENT EXISTENCE
         * ========================================================
         */

        const student =
            await this.composite.findById(studentId)

        if (!student) {
            throw AppError.notFound(
                "Siswa tidak ditemukan"
            )
        }

        /**
         * ========================================================
         * MAPPING DTO → ENTITY
         * ========================================================
         */

        const entity =
            StudentCounselingCaseMapper.fromOpenDTO(
                studentId,
                dto
            )

        /**
         * ========================================================
         * PERSISTENCE
         * ========================================================
         */

        return this.repo.create(entity)

    }

}