//Files: src/modules/achievement/infrastructure/http/AchievementController.ts
import type { NextRequest } from "next/server";
import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";

import type { AchievementService } from "@/modules/achievement/application/services/AchievementService";

import {
    CreateAchievementSchema,
    UpdateAchievementSchema
} from "@/modules/achievement/infrastructure/validators/achievementMaster.validator";

import { handleZodError } from "@/modules/shared/errors/handleZodError";

/**
 * ============================================================
 * ACHIEVEMENT CONTROLLER
 * ============================================================
 *
 * Responsibility:
 * - Handle HTTP layer only
 * - Validate request payload (Zod)
 * - Delegate business logic to service
 * - Convert Result<T> into HTTP response via HttpResultHandler
 *
 * Notes:
 * - No business logic here
 * - No manual Result checking
 * - No isFailure usage
 * - No manual Response.json branching
 */
export class AchievementController {
    constructor(
        private readonly service: AchievementService
    ) {}

    /**
     * ======================================
     * ============ LIST (GET ALL) ==========
     * ======================================
     * GET /api/achievements-master
     */
    async getAll() {
        const result = await this.service.list();
        return HttpResultHandler.handle(result);
    }

    /**
     * ======================================
     * ============ GET BY ID ===============
     * ======================================
     * GET /api/achievements-master/:id
     */
    async getById(id: string) {
        const result = await this.service.getById(id);
        return HttpResultHandler.handle(result);
    }

    /**
     * ======================================
     * ============== CREATE ================
     * ======================================
     * POST /api/achievements-master
     */
    async create(req: NextRequest) {
        try {
            const body = CreateAchievementSchema.parse(
                await req.json()
            );

            const result = await this.service.create(body);

            return HttpResultHandler.handle(result, 201);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /**
     * ======================================
     * ============== UPDATE ================
     * ======================================
     * PUT /api/achievements-master/:id
     */
    async update(id: string, req: NextRequest) {
        try {
            const body = UpdateAchievementSchema.parse(
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
     * ======================================
     * ============== DELETE ================
     * ======================================
     * DELETE /api/achievements-master/:id
     *
     * - Soft delete
     * - Rejected if achievement already used
     */
    async delete(id: string) {
        const result = await this.service.delete(id);
        return HttpResultHandler.handle(result);
    }
}