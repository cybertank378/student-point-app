//Files: src/modules/academic-year/infrastructure/http/AcademicYearController.ts
import type { NextRequest } from "next/server";

import { AcademicYearService } from "@/modules/academic-year/application/services/AcademicYearService";

import {
    CreateAcademicYearSchema,
    UpdateAcademicYearSchema,
    type CreateAcademicYearInput,
    type UpdateAcademicYearInput,
} from "@/modules/academic-year/infrastructure/validators/AcademicYearSchema";

import { handleZodError } from "@/modules/shared/errors/handleZodError";
import { serverLog } from "@/libs/serverLogger";

export class AcademicYearController {
    constructor(
        private readonly service: AcademicYearService,
    ) {}

    /* ========================= GET ALL ========================= */

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

    /* ========================= GET BY ID ========================= */

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

    /* ========================= CREATE ========================= */

    async create(req: NextRequest) {
        try {
            const json = await req.json();

            serverLog("Incoming Payload:", json);

            // 🔥 VALIDATE + TRANSFORM
            const body: CreateAcademicYearInput = CreateAcademicYearSchema.parse(json);

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

    /* ========================= UPDATE ========================= */

    async update(id: string, req: NextRequest) {
        try {
            const json = await req.json();

            const body: UpdateAcademicYearInput =
                UpdateAcademicYearSchema.parse(json);

            const result =
                await this.service.update({
                    id,
                    ...body,
                    isActive: false
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

    /* ========================= SET ACTIVE ========================= */

    async setActive(id: string) {
        const result =
            await this.service.setActive(id);

        if (result.isFailure) {
            return Response.json(
                { error: result.getError() },
                { status: 400 },
            );
        }

        return Response.json({ success: true });
    }

    /* ========================= DELETE ========================= */

    async delete(id: string) {
        const result =
            await this.service.delete(id);

        if (result.isFailure) {
            return Response.json(
                { error: result.getError() },
                { status: 400 },
            );
        }

        return Response.json({ success: true });
    }
}
