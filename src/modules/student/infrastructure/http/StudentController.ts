//Files: src/modules/student/infrastructure/http/StudentController.ts
import type { NextRequest } from "next/server";

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import { handleZodError } from "@/modules/shared/errors/handleZodError";

import type { StudentService } from "@/modules/student/application/services/StudentService";

import {
    AssignAcademicYearSchema,
    AssignRombelSchema,
    BatchAssignAcademicYearSchema,
    BatchAssignRombelSchema,
    CreateStudentSchema,
    StudentQuerySchema,
    UpdateStudentSchema,
} from "@/modules/student/infrastructure/validators/student.validator";

/**
 * ============================================================
 * STUDENT CONTROLLER
 * ============================================================
 *
 * Responsibility:
 * - Validate input (Zod)
 * - Delegate to service
 * - Convert Result<T> → HTTP via HttpResultHandler
 *
 * No business logic here.
 */
export class StudentController {
    constructor(private readonly service: StudentService) {}

    /* ======================================
       LIST
    ====================================== */
    async getAll(req: NextRequest) {
        try {
            const parsed = StudentQuerySchema.parse(
                Object.fromEntries(req.nextUrl.searchParams)
            );

            const { page, limit, ...query } = parsed;

            const result = await this.service.getAll(query);

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            const rows = result.getValue();
            const total = rows.length;

            const start = (page - 1) * limit;
            const end = start + limit;

            return Response.json({
                rows: rows.slice(start, end),
                total,
            });
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ======================================
       GET BY ID
    ====================================== */
    async getById(id: string) {
        const result = await this.service.getById(id);
        return HttpResultHandler.handle(result);
    }

    /* ======================================
       GET BY NIS
    ====================================== */
    async getByNis(nis: number) {
        const result = await this.service.getByNis(nis);
        return HttpResultHandler.handle(result);
    }

    /* ======================================
       CREATE
    ====================================== */
    async create(req: NextRequest) {
        try {
            const body = CreateStudentSchema.parse(
                await req.json()
            );

            const result = await this.service.create(body);

            return HttpResultHandler.handle(result, 201);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ======================================
       UPDATE
    ====================================== */
    async update(id: string, req: NextRequest) {
        try {
            const body = UpdateStudentSchema.parse(
                await req.json()
            );

            const result = await this.service.update({
                id,
                ...body,
            });

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ======================================
       DELETE
    ====================================== */
    async delete(id: string) {
        const result = await this.service.delete(id);
        return HttpResultHandler.handle(result);
    }

    /* ======================================
       ASSIGN ROMBEL
    ====================================== */
    async assignRombel(req: NextRequest) {
        try {
            const body = AssignRombelSchema.parse(
                await req.json()
            );

            const result = await this.service.assignToRombel({
                studentId: body.studentId,
                rombelId: body.rombelId,
            });

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ======================================
       BATCH ASSIGN ROMBEL
    ====================================== */
    async batchAssignRombel(req: NextRequest) {
        try {
            const body = BatchAssignRombelSchema.parse(
                await req.json()
            );

            const result =
                await this.service.batchAssignToRombel({
                    studentIds: body.studentIds,
                    rombelId: body.rombelId,
                });

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ======================================
       ASSIGN ACADEMIC YEAR
    ====================================== */
    async assignAcademicYear(req: NextRequest) {
        try {
            const body =
                AssignAcademicYearSchema.parse(
                    await req.json()
                );

            const result =
                await this.service.assignAcademicYear({
                    studentId: body.studentId,
                    rombelId: body.rombelId,
                });

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ======================================
       BATCH ASSIGN ACADEMIC YEAR
    ====================================== */
    async batchAssignAcademicYear(req: NextRequest) {
        try {
            const body =
                BatchAssignAcademicYearSchema.parse(
                    await req.json()
                );

            const result =
                await this.service.batchAssignAcademicYear({
                    studentIds: body.studentIds,
                    rombelId: body.rombelId,
                });

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }
}