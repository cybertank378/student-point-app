//Files: src/modules/student-profile/infrastructure/http/StudentProfileController.ts

import {NextRequest} from "next/server";
import {HttpResultHandler} from "@/modules/shared/http/HttpResultHandler";
import {StudentProfileService} from "@/modules/student-profile/application/services/StudentProfileService";
import {
    CreateStudentProfileSchema, UpdateStudentProfileSchema
} from "@/modules/student-profile/infrastructure/validators/student.profile.validator";

/**
 * ============================================================
 * STUDENT PROFILE CONTROLLER
 * ============================================================
 *
 * HTTP adapter responsible for handling student profile requests.
 *
 * Responsibilities:
 * - parse HTTP request
 * - validate request using Zod
 * - call application service
 * - return standardized HTTP response
 */

export class StudentProfileController {

    constructor(
        private readonly service: StudentProfileService
    ) {}

    /**
     * ============================================================
     * GET STUDENT PROFILE
     * ============================================================
     */

    async get(
        _req: NextRequest,
        studentId: string
    ): Promise<Response> {

        const result =
            await this.service.getProfile(studentId)

        return HttpResultHandler.handle(result)

    }

    /**
     * ============================================================
     * CREATE STUDENT PROFILE
     * ============================================================
     */

    async create(
        req: NextRequest
    ): Promise<Response> {

        const payload =
            CreateStudentProfileSchema.parse(
                await req.json()
            )

        const result =
            await this.service.createProfile(payload)

        return HttpResultHandler.handle(result, 201)

    }

    /**
     * ============================================================
     * UPDATE STUDENT PROFILE
     * ============================================================
     */

    async update(
        req: NextRequest,
        studentId: string
    ): Promise<Response> {

        const payload =
            UpdateStudentProfileSchema.parse({
                studentId,
                ...(await req.json())
            })

        const result =
            await this.service.updateProfile(payload)

        return HttpResultHandler.handle(result)

    }

    /**
     * ============================================================
     * DELETE STUDENT PROFILE
     * ============================================================
     */

    async delete(
        _req: NextRequest,
        studentId: string
    ): Promise<Response> {

        const result =
            await this.service.deleteProfile(studentId)

        return HttpResultHandler.handle(result)

    }

}