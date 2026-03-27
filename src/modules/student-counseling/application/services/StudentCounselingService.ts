//Files: src/modules/student-counseling/application/services/StudentCounselingService.ts
//Files: src/modules/student-counseling/application/services/StudentCounselingService.ts

import { BaseAppServices }
    from "@/modules/shared/core/BaseAppServices"

import { OpenStudentCounselingCaseUseCase }
    from "@/modules/student-counseling/application/usecases/OpenStudentCounselingCaseUseCase"

import { UpdateCounselingCaseUseCase }
    from "@/modules/student-counseling/application/usecases/UpdateStudentCounselingCaseUseCase"

import { CloseCounselingCaseUseCase }
    from "@/modules/student-counseling/application/usecases/CloseStudentCounselingCaseUseCase"

import {
    StudentCounselingCaseInterface
} from "@/modules/student-counseling/domain/interfaces/StudentCounselingCaseInterface"

import { OpenStudentCounselingCaseDTO }
    from "@/modules/student-counseling/domain/dto/OpenStudentCounselingCaseDTO"

import { UpdateStudentCounselingCaseDTO }
    from "@/modules/student-counseling/domain/dto/UpdateStudentCounselingCaseDTO"
import {StudentCompositeService} from "@/modules/student-composite/application/services/StudentCompositeService";
import {StudentCompositeInterface} from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface";


/**
 * ============================================================
 * STUDENT COUNSELING SERVICE
 * ============================================================
 *
 * Service layer pada modul Student Counseling yang berfungsi
 * sebagai facade untuk seluruh UseCase pada modul ini.
 *
 * Tujuan
 * - Menyediakan entry point tunggal bagi Controller
 * - Mengelola eksekusi UseCase melalui BaseAppServices
 * - Menghindari instansiasi UseCase berulang
 *
 * Catatan Arsitektur
 * - Service tidak menyimpan business rule
 * - Business rule berada di UseCase
 * - Service hanya melakukan orchestration
 */
export class StudentCounselingService extends BaseAppServices {

    private readonly openUC: OpenStudentCounselingCaseUseCase

    private readonly updateUC: UpdateCounselingCaseUseCase

    private readonly closeUC: CloseCounselingCaseUseCase

    constructor(
        repo: StudentCounselingCaseInterface,
        compositeRepo: StudentCompositeInterface
    ) {

        super()

        this.openUC = new OpenStudentCounselingCaseUseCase(repo, compositeRepo)

        this.updateUC = new UpdateCounselingCaseUseCase(repo)

        this.closeUC = new CloseCounselingCaseUseCase(repo)

    }

    /**
     * ============================================================
     * OPEN STUDENT COUNSELING CASE
     * ============================================================
     *
     * Membuka kasus konseling baru untuk seorang siswa.
     */
    openStudentCounselingCase(
        dto: {
            studentId: string
            dto: OpenStudentCounselingCaseDTO
        }
    ) {

        return this.execute(
            this.openUC,
            dto
        )

    }

    /**
     * ============================================================
     * UPDATE STUDENT COUNSELING CASE
     * ============================================================
     *
     * Melakukan perubahan parsial terhadap kasus konseling siswa.
     */
    updateStudentCounselingCase(
        dto: {
            caseId: string
            dto: UpdateStudentCounselingCaseDTO
        }
    ) {

        return this.execute(
            this.updateUC,
            dto
        )

    }

    /**
     * ============================================================
     * CLOSE STUDENT COUNSELING CASE
     * ============================================================
     *
     * Menutup kasus konseling siswa.
     */
    closeStudentCounselingCase(
        caseId: string
    ) {

        return this.execute(
            this.closeUC,
            { caseId }
        )

    }

}