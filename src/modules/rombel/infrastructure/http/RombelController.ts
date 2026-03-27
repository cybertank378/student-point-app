//Files: src/modules/rombel/infrastructure/http/RombelController.ts

import type { NextRequest } from "next/server";

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";

import type { RombelService } from "@/modules/rombel/application/services/RombelService";


import { handleZodError } from "@/modules/shared/errors/handleZodError";
import {
    CreateRombelInput,
    CreateRombelSchema,
    UpdateRombelInput, UpdateRombelSchema
} from "@/modules/rombel/infrastructure/validators/rombel.validator";

export class RombelController {

    constructor(
        private readonly service: RombelService
    ) {}

    /* ================= GET ALL ================= */

    async getAll() {
        const result = await this.service.getAll();
        return HttpResultHandler.handle(result);
    }

    /* ================= GET BY ID ================= */

    async getById(id: string) {
        const result = await this.service.getById(id);
        return HttpResultHandler.handle(result);
    }

    /* ================= CREATE ================= */

    async create(req: NextRequest) {

        try {

            const json = await req.json();

            const body: CreateRombelInput =
                CreateRombelSchema.parse(json);

            const result = await this.service.create(body);

            return HttpResultHandler.handle(result, 201);

        } catch (error) {

            return handleZodError(error);

        }

    }

    /* ================= UPDATE ================= */

    async update(id: string, req: NextRequest) {

        try {

            const json = await req.json();

            const body: UpdateRombelInput =
                UpdateRombelSchema.parse(json);

            const result = await this.service.update({
                id,
                ...body,
            });

            return HttpResultHandler.handle(result);

        } catch (error) {

            return handleZodError(error);

        }

    }

    /* ================= DELETE ================= */

    async delete(id: string) {

        const result = await this.service.delete(id);

        return HttpResultHandler.handle(result);

    }

}