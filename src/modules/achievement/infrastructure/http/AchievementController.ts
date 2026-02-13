//Files: src/modules/achievement/infrastructure/http/AchievementController.ts

import type { NextRequest } from "next/server";

import type { AchievementService } from "@/modules/achievement/application/services/AchievementService";
import {
    CreateAchievementSchema,
    UpdateAchievementSchema
} from "@/modules/achievement/infrastructure/validators/achievementMaster.validator";
import {handleZodError} from "@/modules/shared/errors/handleZodError";


export class AchievementController {
    constructor(
        private readonly service: AchievementService,
    ) {}

    /**
     * ======================================
     * ============ LIST (GET ALL) ===========
     * ======================================
     * GET /api/achievements-master
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
     * GET /api/achievements-master/:id
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
     * POST /api/achievements-master
     */
    async create(req: NextRequest) {
        try {
            const body = CreateAchievementSchema.parse(
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
     * PUT /api/achievements-master/:id
     */
    async update(id: string, req: NextRequest) {
        try {
            const body = UpdateAchievementSchema.parse(
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
     * DELETE /api/achievements-master/:id
     *
     * - SOFT DELETE
     * - DITOLAK jika achievement sudah dipakai
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
