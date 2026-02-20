//Files: src/modules/teacher/infrastructure/http/http/TeacherController.ts
import { NextRequest, NextResponse } from "next/server";
import type { TeacherService } from "@/modules/teacher/application/services/TeacherService";

import {
    AssignHomeroomSchema,
    AssignTeacherRoleSchema,
    CreateTeacherSchema,
    UpdateTeacherSchema,
    ListTeacherSchema,
    SearchTeacherSchema,
    ImportTeacherSchema,
} from "@/modules/teacher/infrastructure/validators/teacher.validator";

import { handleZodError } from "@/modules/shared/errors/handleZodError";
import { TeacherPresenter } from "@/modules/teacher/presentation/presenters/TeacherPresenter";
import {HttpResultHandler} from "@/modules/shared/http/HttpResultHandler";
import {getQueryParam} from "@/modules/shared/http/QueryParams";
import {serverLog} from "@/libs/serverLogger";

/**
 * ============================================================
 * TEACHER CONTROLLER
 * ============================================================
 *
 * HTTP Adapter untuk modul Teacher.
 *
 * Tanggung Jawab:
 * - Validasi request (Zod)
 * - Delegasi ke TeacherService
 * - Transform entity → response (Presenter)
 *
 * Tidak mengandung business logic.
 */
export class TeacherController {
    constructor(private readonly service: TeacherService) {}

    /* ==========================================================
       LIST (PAGINATION)
       ========================================================== */

    async list(request: NextRequest) {
        try {
            const { searchParams } = new URL(request.url);

            const parsed = ListTeacherSchema.parse({
                page: searchParams.get("page"),
                limit: searchParams.get("limit"),
                search: searchParams.get("search") ?? undefined,
            });

            const result = await this.service.getAll(parsed);

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            const value = result.getValue();

            return NextResponse.json(
                {
                    data: TeacherPresenter.toResponseList(value.data),
                    total: value.total,
                    page: value.page,
                    limit: value.limit,
                    totalPages: Math.ceil(value.total / value.limit),
                },
                { status: 200 }
            );

        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       GET BY ID
       ========================================================== */

    async getById(id: string) {

        serverLog("ID:", id);

        const result = await this.service.getById(id);

        if (!result.isSuccess) {
            return HttpResultHandler.handle(result);
        }

        return NextResponse.json(
            TeacherPresenter.toResponse(result.getValue()),
            { status: 200 }
        );
    }

    /* ==========================================================
       CREATE
       ========================================================== */

    async create(req: NextRequest) {
        try {
            const body = CreateTeacherSchema.parse(await req.json());
            const result = await this.service.create(body);

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            return NextResponse.json(
                TeacherPresenter.toResponse(result.getValue()),
                { status: 201 }
            );

        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       UPDATE
       ========================================================== */

    async update(id: string, req: NextRequest) {
        try {
            const body = UpdateTeacherSchema.parse(await req.json());
            const result = await this.service.update({ id, ...body });

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            return NextResponse.json(
                TeacherPresenter.toResponse(result.getValue()),
                { status: 200 }
            );

        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       DELETE
       ========================================================== */

    async delete(id: string) {
        const result = await this.service.delete(id);
        return HttpResultHandler.handle(result);
    }

    /* ==========================================================
       ASSIGN ROLE
       ========================================================== */

    async assignRole(id: string, req: NextRequest) {
        try {
            const body = AssignTeacherRoleSchema.parse(await req.json());

            const result = await this.service.assignRole({
                teacherId: id,
                roles: body.roles,
            });

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            return NextResponse.json(
                TeacherPresenter.toResponse(result.getValue()),
                { status: 200 }
            );

        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       ASSIGN HOMEROOM
       ========================================================== */

    async assignHomeroom(req: NextRequest) {
        try {
            const dto = AssignHomeroomSchema.parse(await req.json());
            const result = await this.service.assignHomeroom(dto);

            return HttpResultHandler.handle(result);

        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       SEARCH
       ========================================================== */

    async search(request: NextRequest) {
        try {
            const { searchParams } = new URL(request.url);

            const parsed = SearchTeacherSchema.parse({
                page: getQueryParam(searchParams.get("page")),
                limit: getQueryParam(searchParams.get("limit")),
                name: getQueryParam(searchParams.get("name")),
                role: getQueryParam(searchParams.get("role")),
                religionCode: getQueryParam(searchParams.get("religionCode")),
                sortBy: getQueryParam(searchParams.get("sortBy")),
                sortOrder: getQueryParam(searchParams.get("sortOrder")),
            });

            const result = await this.service.search(parsed);

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            const value = result.getValue();

            return NextResponse.json(
                {
                    data: TeacherPresenter.toResponseList(value.data),
                    total: value.total,
                    page: value.page,
                    limit: value.limit,
                },
                { status: 200 }
            );

        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       IMPORT
       ========================================================== */

    async import(req: NextRequest) {
        try {
            const body = ImportTeacherSchema.parse(await req.json());
            const result = await this.service.import(body);
            return HttpResultHandler.handle(result);

        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       EXPORT
       ========================================================== */

    async export() {
        const result = await this.service.export();
        return HttpResultHandler.handle(result);
    }
}
