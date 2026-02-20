//Files: src/modules/religion/infrastructure/http/ReligionController.ts
import type { NextRequest } from "next/server";

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import { handleZodError } from "@/modules/shared/errors/handleZodError";

import type { ReligionService } from "@/modules/religion/application/services/ReligionService";

import {
    CreateReligionSchema,
    UpdateReligionSchema,
} from "@/modules/religion/infrastructure/validators/religion.validator";

/**
 * ============================================================
 * RELIGION CONTROLLER
 * ============================================================
 *
 * Responsibility:
 * - Handle HTTP layer only
 * - Validate request input (Zod)
 * - Delegate business logic to service
 * - Convert Result<T> into HTTP response via HttpResultHandler
 *
 * No business logic here.
 */
export class ReligionController {
    constructor(private readonly service: ReligionService) {}

    /**
     * GET /api/religions
     */
    async getAll() {
        const result = await this.service.getAll();
        return HttpResultHandler.handle(result);
    }

    /**
     * GET /api/religions/:id
     */
    async getById(id: string) {
        const result = await this.service.getById(id);
        return HttpResultHandler.handle(result);
    }

    /**
     * POST /api/religions
     */
    async create(req: NextRequest) {
        try {
            const body = CreateReligionSchema.parse(
                await req.json()
            );

            const result = await this.service.create(body);

            return HttpResultHandler.handle(result, 201);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /**
     * PUT /api/religions/:id
     */
    async update(id: string, req: NextRequest) {
        try {
            const body = UpdateReligionSchema.parse(
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

    /**
     * DELETE /api/religions/:id
     */
    async delete(id: string) {
        const result = await this.service.delete(id);
        return HttpResultHandler.handle(result);
    }
}