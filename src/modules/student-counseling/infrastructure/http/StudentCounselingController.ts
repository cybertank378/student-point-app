//Files: src/modules/student-counseling/infrastructure/http/StudentCounselingController.ts
import { NextRequest } from "next/server"

import { HttpResultHandler }
    from "@/modules/shared/http/HttpResultHandler"

import { StudentCounselingService }
    from "@/modules/student-counseling/application/services/StudentCounselingService"

import { OpenStudentCounselingCaseDTO }
    from "@/modules/student-counseling/domain/dto/OpenStudentCounselingCaseDTO"

import { UpdateStudentCounselingCaseDTO }
    from "@/modules/student-counseling/domain/dto/UpdateStudentCounselingCaseDTO"

import {
    openStudentCounselingValidator,
    updateStudentCounselingValidator
} from "@/modules/student-counseling/infrastructure/validators/student.counseling.validator"

/**
 * ============================================================
 * STUDENT COUNSELING CONTROLLER
 * ============================================================
 *
 * HTTP adapter untuk modul Student Counseling.
 *
 * Tanggung jawab
 * - menerima request HTTP
 * - validasi input menggunakan Zod
 * - memanggil service
 * - mengubah Result<T> menjadi HTTP response
 */

export class StudentCounselingController {

    constructor(
        private readonly service: StudentCounselingService
    ) {}

    /**
     * ============================================================
     * OPEN COUNSELING CASE
     * ============================================================
     *
     * POST /students/:id/counseling
     */

    openCase = async (
        req: NextRequest,
        studentId: string
    ): Promise<Response> => {

        const body = await req.json()

        const parsed =
            openStudentCounselingValidator.parse(body)

        const dto =
            new OpenStudentCounselingCaseDTO(parsed)

        const result =
            await this.service.openStudentCounselingCase({studentId,dto})

        return HttpResultHandler.handle(result)

    }

    /**
     * ============================================================
     * UPDATE COUNSELING CASE
     * ============================================================
     *
     * PATCH /students/counseling/:caseId
     */

    updateCase = async (
        req: NextRequest,
        caseId: string
    ): Promise<Response> => {

        const body = await req.json()

        const parsed = updateStudentCounselingValidator.parse(body)

        const dto = new UpdateStudentCounselingCaseDTO(parsed)

        const result = await this.service.updateStudentCounselingCase({ caseId, dto})

        return HttpResultHandler.handle(result)

    }

    /**
     * ============================================================
     * CLOSE COUNSELING CASE
     * ============================================================
     *
     * PATCH /students/counseling/:caseId/close
     */

    closeCase = async (
        _req: NextRequest,
        caseId: string
    ): Promise<Response> => {

        const result =
            await this.service.closeStudentCounselingCase(
                caseId
            )

        return HttpResultHandler.handle(result)

    }

}