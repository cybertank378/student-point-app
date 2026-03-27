//Files: src/modules/student-aid/infrastructure/http/StudentAidController.ts
import { NextRequest } from "next/server";

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import {StudentAidService} from "@/modules/student-aid/application/services/StudentAidService";
import {
    CreateStudentAidSchema,
    UpdateStudentAidSchema
} from "@/modules/student-aid/infrastructure/validator/studentaid.validator";
import {StudentAidDTO} from "@/modules/student-aid/domain/dto/StudentAidDTO";


/**
 * ============================================================
 * STUDENT AID CONTROLLER
 * ============================================================
 *
 * HTTP adapter responsible for handling student aid requests.
 *
 * Responsibilities:
 * - Parse HTTP request
 * - Validate input using Zod schema
 * - Delegate execution to application service
 * - Return standardized HTTP response
 *
 * Controller must remain free of business logic.
 */

export class StudentAidController {

    constructor(
        private readonly service: StudentAidService
    ) {}

    /**
     * ============================================================
     * GET STUDENT AID
     * ============================================================
     *
     * Retrieve aid records belonging to a student.
     *
     * @param _req - incoming HTTP request
     * @param studentId - student identifier
     */
    async get(
        _req: NextRequest,
        studentId: string
    ): Promise<Response> {

        const result =
            await this.service.getStudentAidByStudentId(
                studentId
            );

        return HttpResultHandler.handle(result);

    }

    /**
     * ============================================================
     * CREATE STUDENT AID
     * ============================================================
     *
     * Assign government aid to a student.
     *
     * @param req - incoming HTTP request
     * @param studentId - student identifier
     */
    async create(
        req: NextRequest,
        studentId: string
    ): Promise<Response> {

        const body =
            CreateStudentAidSchema.parse(
                await req.json()
            );

        const dto: Omit<StudentAidDTO, "id"> = {

            studentId,

            academicYearId:
            body.academicYearId,

            kjp:
            body.kjp,

            pip:
            body.pip

        };

        const result =
            await this.service.assignStudentAid(dto);

        return HttpResultHandler.handle(result, 201);

    }

    /**
     * ============================================================
     * UPDATE STUDENT AID
     * ============================================================
     *
     * Update an existing student aid record.
     *
     * @param req - incoming HTTP request
     * @param studentId - student identifier
     */
    async update(
        req: NextRequest,
        studentId: string
    ): Promise<Response> {

        const body =
            UpdateStudentAidSchema.parse(
                await req.json()
            );

        const dto: StudentAidDTO = {

            id:
            body.id,

            studentId,

            academicYearId:
            body.academicYearId,

            kjp:
            body.kjp,

            pip:
            body.pip

        };

        const result =
            await this.service.updateStudentAid(dto);

        return HttpResultHandler.handle(result);

    }

}