//Files: src/modules/academic-year/infrastructure/http/AcademicYearController.ts

import type { NextRequest } from "next/server";

import { AcademicYearService } from "@/modules/academic-year/application/services/AcademicYearService";


import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";
import {
    CreateAcademicYearSchema,
    UpdateAcademicYearSchema
} from "@/modules/academic-year/infrastructure/validators/academicYear.validator";
import {handleZodError} from "@/modules/shared/errors/handleZodError";

export class AcademicYearController {
    constructor(
        private readonly service: AcademicYearService,
    ) {}

    /**
     * ======================================
     * ============ LIST (GET ALL) ==========
     * ======================================
     * GET /api/academic-years
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
     * ======================================
     * ============ GET BY ID ===============
     * ======================================
     * GET /api/academic-years/:id
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
     * POST /api/academic-years
     */
    async create(req: NextRequest) {
        try {
            const body =
                CreateAcademicYearSchema.parse(
                    await req.json(),
                ) as CreateAcademicYearDTO;

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
     * PUT /api/academic-years/:id
     */
    async update(id: string, req: NextRequest) {
        try {
            const body =
                UpdateAcademicYearSchema.parse(
                    await req.json(),
                ) as Omit<UpdateAcademicYearDTO, "id">;

            const result = await this.service.update({
                id,
                name: body.name,
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
     * ============ SET ACTIVE ==============
     * ======================================
     * PATCH /api/academic-years/:id/activate
     */
    async setActive(id: string) {
        const result = await this.service.setActive(id);

        if (result.isFailure) {
            return Response.json(
                { error: result.getError() },
                { status: 400 },
            );
        }

        return Response.json({ success: true });
    }

    /**
     * ======================================
     * ============== DELETE ===============
     * ======================================
     * DELETE /api/academic-years/:id
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
