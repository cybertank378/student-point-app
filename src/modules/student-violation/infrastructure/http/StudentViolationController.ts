// Files: src/modules/student-violation/infrastructure/http/StudentViolationController.ts

import { NextRequest } from "next/server"

import { HttpResultHandler }
    from "@/modules/shared/http/HttpResultHandler"

import { StudentViolationService }
    from "@/modules/student-violation/application/services/StudentViolationService"

import {
    RecordViolationSchema,
    ResolveViolationSchema
} from "@/modules/student-violation/infrastructure/validators/studentViolation.validator"

/**
 * ============================================================
 * STUDENT VIOLATION CONTROLLER
 * ============================================================
 *
 * HTTP adapter responsible for handling student violation requests.
 *
 * Responsibilities:
 * - parse HTTP request
 * - validate request using Zod
 * - call application service
 * - return standardized HTTP response
 */
export class StudentViolationController {

    constructor(
        private readonly service: StudentViolationService
    ) {}

    /**
     * ============================================================
     * LIST STUDENT VIOLATIONS
     * ============================================================
     */

    async list(
        _req: NextRequest,
        studentId: string
    ): Promise<Response> {

        const result =
            await this.service.listByStudent(studentId)

        return HttpResultHandler.handle(result)

    }

    /**
     * ============================================================
     * GET VIOLATION HISTORY BY ACADEMIC YEAR
     * ============================================================
     */

    async history(
        _req: NextRequest,
        studentId: string,
        academicYearId: string
    ): Promise<Response> {

        const result =
            await this.service.historyByAcademicYear(
                studentId,
                academicYearId
            )

        return HttpResultHandler.handle(result)

    }

    /**
     * ============================================================
     * RECORD STUDENT VIOLATION
     * ============================================================
     */

    async create(
        req: NextRequest,
        studentId: string
    ): Promise<Response> {

        const body = await req.json()

        const payload =
            RecordViolationSchema.parse({
                ...body,
                studentId
            })

        const result = await this.service.record(payload)

        return HttpResultHandler.handle(result, 201)

    }

    /**
     * ============================================================
     * RESOLVE / UPDATE VIOLATION STATUS
     * ============================================================
     */

    async resolve(
        req: NextRequest,
        violationId: string
    ): Promise<Response> {

        const payload =
            ResolveViolationSchema.parse({
                violationId,
                ...(await req.json())
            })

        const result =
            await this.service.resolve(payload)

        return HttpResultHandler.handle(result)

    }

}