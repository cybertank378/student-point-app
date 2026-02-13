//Files: src/modules/violation/infrastructur/http/ViolationController.ts

import type { NextRequest } from "next/server";
import type { ViolationService } from "@/modules/violation/application/services/ViolationService";
import {
    CreateViolationSchema,
    UpdateViolationSchema
} from "@/modules/violation/infrastructur/validators/violationMaster.validator";
import {handleZodError} from "@/modules/shared/errors/handleZodError";


export class ViolationController {
    constructor(
        private readonly service: ViolationService,
    ) {}

    /**
     * ======================================
     * ============ LIST (GET ALL) ===========
     * ======================================
     * GET /api/violations-master
     */
    async getAll() {
        const result = await this.service.list();

        if (result.isFailure) {
            return Response.json(
                { error: result.getError() },
                { status: 400 },
            );
        }

        return Response.json(result.getValue());
    }

    /**
     * ======================================
     * ============ GET BY ID ===============
     * ======================================
     * GET /api/violations-master/:id
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
     * ======================================
     * ============== CREATE ===============
     * ======================================
     * POST /api/violations-master
     */
    async create(req: NextRequest) {
        try {
            const body = CreateViolationSchema.parse(
                await req.json(),
            );

            const result = await this.service.create(body);

            if (result.isFailure) {
                return Response.json(
                    { error: result.getError() },
                    { status: 400 },
                );
            }

            return Response.json(result.getValue(), {
                status: 201,
            });
        } catch (error) {
            return handleZodError(error);
        }
    }

    /**
     * ======================================
     * ============== UPDATE ===============
     * ======================================
     * PUT /api/violations-master/:id
     */
    async update(id: string, req: NextRequest) {
        try {
            const body = UpdateViolationSchema.parse(
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
     * ======================================
     * ============== DELETE ===============
     * ======================================
     * DELETE /api/violations-master/:id
     *
     * - SOFT DELETE
     * - DITOLAK jika violation sudah dipakai
     */
    async delete(id: string) {
        const result = await this.service.delete(id);

        if (result.isFailure) {
            return Response.json(
                { error: result.getError()},
                { status: 400 },
            );
        }

        return Response.json({ success: true });
    }
}

