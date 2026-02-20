//Files: src/modules/academic-year/infrastructure/http/AcademicYearController.ts
import type { NextRequest } from "next/server";
import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";

import type { AcademicYearService } from "@/modules/academic-year/application/services/AcademicYearService";

import {
    CreateAcademicYearSchema,
    UpdateAcademicYearSchema,
    type CreateAcademicYearInput,
    type UpdateAcademicYearInput,
} from "@/modules/academic-year/infrastructure/validators/AcademicYearSchema";

import { handleZodError } from "@/modules/shared/errors/handleZodError";
import { serverLog } from "@/libs/serverLogger";

/**
 * ============================================================
 * ACADEMIC YEAR CONTROLLER
 * ============================================================
 *
 * Responsibility:
 * - Handle HTTP layer only
 * - Validate request input
 * - Delegate business logic to service
 * - Convert Result<T> into HTTP response via HttpResultHandler
 *
 * Notes:
 * - No business logic here
 * - No manual Result checking
 * - No isFailure usage (removed in new Result pattern)
 */
export class AcademicYearController {
    constructor(private readonly service: AcademicYearService) {}

    /* ========================= GET ALL ========================= */

    async getAll() {
        const result = await this.service.getAll();
        return HttpResultHandler.handle(result);
    }

    /* ========================= GET BY ID ========================= */

    async getById(id: string) {
        const result = await this.service.getById(id);
        return HttpResultHandler.handle(result);
    }

    /* ========================= CREATE ========================= */

    async create(req: NextRequest) {
        try {
            const json = await req.json();

            serverLog("Incoming Payload:", json);

            // ✅ Validate + transform input
            const body: CreateAcademicYearInput =CreateAcademicYearSchema.parse(json);

            const result = await this.service.create(body);

            return HttpResultHandler.handle(result, 201);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ========================= UPDATE ========================= */

    async update(id: string, req: NextRequest) {
        try {
            const json = await req.json();

            const body: UpdateAcademicYearInput =UpdateAcademicYearSchema.parse(json);

            const result = await this.service.update({
                id,
                ...body,
                isActive: false,
            });

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ========================= SET ACTIVE ========================= */

    async setActive(id: string) {
        const result = await this.service.setActive(id);
        return HttpResultHandler.handle(result);
    }

    /* ========================= DELETE ========================= */

    async delete(id: string) {
        const result = await this.service.delete(id);
        return HttpResultHandler.handle(result);
    }
}