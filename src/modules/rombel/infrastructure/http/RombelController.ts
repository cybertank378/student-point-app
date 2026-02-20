//Files: src/modules/rombel/infrastructure/http/RombelController.ts
// src/modules/rombel/infrastructure/http/RombelController.ts
import type { NextRequest } from "next/server";

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import { handleZodError } from "@/modules/shared/errors/handleZodError";

import type { RombelService } from "@/modules/rombel/application/services/RombelService";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";

import {
    CreateRombelSchema,
    UpdateRombelSchema,
} from "@/modules/rombel/infrastructure/validators/rombel.validator";

/**
 * ============================================================
 * ROMBEL CONTROLLER
 * ============================================================
 *
 * Responsibility:
 * - HTTP adapter only
 * - Validate input (Zod)
 * - Delegate to service
 * - Convert Result<T> → HTTP response via HttpResultHandler
 *
 * No business logic here.
 */
export class RombelController {
    constructor(private readonly service: RombelService) {}

    /* ======================================
       LIST (GET ALL)
       GET /api/rombels
    ====================================== */
    async getAll(_req: NextRequest) {
        const result = await this.service.getAll();
        return HttpResultHandler.handle(result);
    }

    /* ======================================
       GET BY ID
       GET /api/rombels/:id
    ====================================== */
    async getById(id: string) {
        const result = await this.service.getById(id);
        return HttpResultHandler.handle(result);
    }

    /* ======================================
       CREATE
       POST /api/rombels
    ====================================== */
    async create(req: NextRequest) {
        try {
            const body = CreateRombelSchema.parse(
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
       PUT /api/rombels/:id
    ====================================== */
    async update(id: string, req: NextRequest) {
        try {
            const body = UpdateRombelSchema.parse(
                await req.json()
            );

            const payload: UpdateRombelDTO = {
                id,
                grade: body.grade,
                name: body.name,
                academicYearId: body.academicYearId,
            };

            const result = await this.service.update(payload);

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ======================================
       DELETE
       DELETE /api/rombels/:id
    ====================================== */
    async delete(id: string) {
        const result = await this.service.delete(id);
        return HttpResultHandler.handle(result);
    }
}