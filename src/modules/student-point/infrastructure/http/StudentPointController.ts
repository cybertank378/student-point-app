//Files: src/modules/student-point/infrastructure/http/StudentPointController.ts

import { NextRequest } from "next/server";

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";

import { StudentPointService } from "@/modules/student-point/application/services/StudentPointService";

import {
    RecalculateStudentPointSchema,
    GetStudentPointSummarySchema,
    ListStudentPointSummarySchema
} from "@/modules/student-point/infrastructure/validators/student.point.validator";

/**
 * ============================================================
 * STUDENT POINT CONTROLLER
 * ============================================================
 *
 * HTTP adapter responsible for handling student point requests.
 *
 * Responsibilities:
 * - Parse HTTP request
 * - Validate input using Zod schema
 * - Delegate execution to application service
 * - Return standardized HTTP response
 *
 * Controller must remain free of business logic.
 */

export class StudentPointController {

    constructor(
        private readonly service: StudentPointService
    ) {}

    /**
     * ============================================================
     * GET STUDENT POINT SUMMARY
     * ============================================================
     *
     * Retrieve discipline point summary for a student
     * within a specific academic year.
     *
     * @param _req - incoming HTTP request
     * @param studentId - student identifier
     * @param academicYearId - academic year identifier
     */

    async get(
        _req: NextRequest,
        studentId: string,
        academicYearId: string
    ): Promise<Response> {

        const dto =
            GetStudentPointSummarySchema.parse({
                studentId,
                academicYearId
            });

        const result =
            await this.service.getStudentPointSummary(dto);

        return HttpResultHandler.handle(result);

    }

    /**
     * ============================================================
     * LIST STUDENT POINT SUMMARY
     * ============================================================
     *
     * Retrieve ranking of students based on discipline points
     * within an academic year.
     *
     * @param _req - incoming HTTP request
     * @param academicYearId - academic year identifier
     */

    async list(
        _req: NextRequest,
        academicYearId: string
    ): Promise<Response> {

        const dto =
            ListStudentPointSummarySchema.parse({
                academicYearId
            });

        const result =
            await this.service.listStudentPointSummary(
                dto.academicYearId
            );

        return HttpResultHandler.handle(result);

    }

    /**
     * ============================================================
     * RECALCULATE STUDENT POINT
     * ============================================================
     *
     * Recalculate student discipline point summary.
     *
     * @param req - incoming HTTP request
     * @param studentId - student identifier
     */

    async recalculate(
        req: NextRequest,
        studentId: string
    ): Promise<Response> {

        const body =
            RecalculateStudentPointSchema.parse(
                await req.json()
            );

        const dto = {

            studentId,

            academicYearId:
            body.academicYearId,

            violationPoint:
            body.violationPoint,

            achievementPoint:
            body.achievementPoint

        };

        const result =
            await this.service.recalculateStudentPoint(dto);

        return HttpResultHandler.handle(result);

    }

}