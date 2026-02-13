//Files: src/modules/religion/infrastructure/http/ReligionController.ts

import type { NextRequest } from "next/server";

import type { ReligionService } from "@/modules/religion/application/services/ReligionService";
import {
    CreateReligionSchema,
    UpdateReligionSchema
} from "@/modules/religion/infrastructure/validators/religion.validator";
import {handleZodError} from "@/modules/shared/errors/handleZodError";



/**
 * ReligionController
 * ------------------
 * HTTP Adapter for Religion module
 */
export class ReligionController {
    constructor(
        private readonly service: ReligionService,
    ) {}

    /**
     * GET /api/religions
     */
    async getAll() {
        const result = await this.service.getAll();

        if (result.isFailure) {
            return Response.json(
                { error: result.getError() },
                { status: 400 },
            );
        }

        return Response.json(result.getValue());
    }

    /**
     * GET /api/religions/:id
     */
    async getById(id: string) {
        const result = await this.service.getById(id);

        if (result.isFailure) {
            return Response.json(
                { error: result.getError() },
                { status: 404 },
            );
        }

        return Response.json(result.getValue());
    }

    /**
     * POST /api/religions
     */
    async create(req: NextRequest) {
        try {
            const body = CreateReligionSchema.parse(
                await req.json(),
            );

            const result = await this.service.create(body);

            if (result.isFailure) {
                return Response.json(
                    { error: result.getError() },
                    { status: 400 },
                );
            }

            return Response.json(
                result.getValue(),
                { status: 201 },
            );
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
                await req.json(),
            );

            const result = await this.service.update({
                id,
                ...body,
            });

            if (result.isFailure) {
                return Response.json(
                    { error: result.getError() },
                    { status: 400 },
                );
            }

            return Response.json(result.getValue());
        } catch (error) {
            return handleZodError(error);
        }
    }

    /**
     * DELETE /api/religions/:id
     */
    async delete(id: string) {
        const result = await this.service.delete(id);

        if (result.isFailure) {
            return Response.json(
                { error: result.getError() },
                { status: 400 },
            );
        }

        return Response.json({ success: true });
    }
}
