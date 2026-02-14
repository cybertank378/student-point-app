//Files: src/modules/rombel/infrastructure/http/RombelController.ts
// src/modules/rombel/infrastructure/http/RombelController.ts

import type { NextRequest } from "next/server";

import { RombelService } from "@/modules/rombel/application/services/RombelService";

import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";

import { handleZodError } from "@/modules/shared/errors/handleZodError";
import {
    CreateRombelSchema,
    UpdateRombelSchema,
} from "@/modules/rombel/infrastructure/validators/rombel.validator";

export class RombelController {
    constructor(
        private readonly service: RombelService,
    ) {}

    /* ======================================
       LIST (GET ALL)
       GET /api/rombels
    ====================================== */
    async getAll(req: NextRequest) {
        const result = await this.service.getAll();

        if (result.isFailure) {
            return Response.json(
                { error: result.getError() },
                { status: 400 },
            );
        }

        return Response.json(result.getValue());
    }

    /* ======================================
       GET BY ID
       GET /api/rombels/:id
    ====================================== */
    async getById(id: string) {
        if (!id) {
            return Response.json(
                { error: "ID is required" },
                { status: 400 },
            );
        }

        const result = await this.service.getById(id);

        if (result.isFailure) {
            return Response.json(
                { error: result.getError() },
                { status: 404 },
            );
        }

        return Response.json(result.getValue());
    }

    /* ======================================
       CREATE
       POST /api/rombels
    ====================================== */
    async create(req: NextRequest) {
        try {
            const body: CreateRombelDTO =
                CreateRombelSchema.parse(await req.json());

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

    /* ======================================
       UPDATE
       PUT /api/rombels/:id
    ====================================== */
    async update(id: string, req: NextRequest) {
        try {
            if (!id) {
                return Response.json(
                    { error: "ID is required" },
                    { status: 400 },
                );
            }

            const body = UpdateRombelSchema.parse(await req.json());

            const payload: UpdateRombelDTO = {
                id,
                grade: body.grade,
                name: body.name,
                academicYearId: body.academicYearId,
            };

            const result = await this.service.update(payload);

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

    /* ======================================
       DELETE
       DELETE /api/rombels/:id
    ====================================== */
    async delete(id: string) {
        if (!id) {
            return Response.json(
                { error: "ID is required" },
                { status: 400 },
            );
        }

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
