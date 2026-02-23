//Files: src/modules/teacher/infrastructure/http/http/TeacherController.ts

import type {TeacherService} from "@/modules/teacher/application/services/TeacherService";

import {
    AssignHomeroomBulkSchema,
    AssignTeacherRoleBulkSchema,
    CreateTeacherSchema,
    ImportTeacherSchema,
    ListTeacherSchema,
    SearchTeacherSchema,
    UpdateTeacherSchema
} from "@/modules/teacher/infrastructure/validators/teacher.validator";

import {handleZodError} from "@/modules/shared/errors/handleZodError";
import {TeacherPresenter} from "@/modules/teacher/presentation/presenters/TeacherPresenter";
import {HttpResultHandler} from "@/modules/shared/http/HttpResultHandler";
import {getQueryParam} from "@/modules/shared/http/QueryParams";
import {Result} from "@/modules/shared/core/Result";
import {NextRequest, NextResponse} from "next/server";
import {ExcelAdapter} from "@/modules/shared/core/ExcelAdapter";
import {TeacherExcelMapper} from "@/modules/teacher/domain/mapper/TeacherExcelMapper";
import {TeacherImportTemplateBuilder} from "@/modules/teacher/infrastructure/http/TeacherImportTemplateBuilder";
import {toApiError} from "@/modules/shared/errors/ApiError";

export class TeacherController {
    constructor(
        private readonly service: TeacherService,
        private readonly excel: ExcelAdapter,
        private readonly mapper: TeacherExcelMapper
    ) {
    }

    /* ==========================================================
       LIST
    ========================================================== */

    async list(request: NextRequest): Promise<Response> {
        try {
            const {searchParams} = new URL(request.url);

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

            const transformed = {
                data: TeacherPresenter.toResponseList(value.data),
                total: value.total,
                page: value.page,
                limit: value.limit,
                totalPages: Math.ceil(value.total / value.limit),
            };

            return HttpResultHandler.handle(Result.ok(transformed));
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       GET BY ID
    ========================================================== */

    async getById(id: string): Promise<Response> {
        const result = await this.service.getById(id);

        if (!result.isSuccess) {
            return HttpResultHandler.handle(result);
        }

        const transformed = TeacherPresenter.toResponse(
            result.getValue()
        );

        return HttpResultHandler.handle(Result.ok(transformed));
    }

    /* ==========================================================
       CREATE
    ========================================================== */

    async create(req: NextRequest): Promise<Response> {
        try {
            const body = CreateTeacherSchema.parse(await req.json());
            const result = await this.service.create(body);

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result, 400);
            }

            const transformed = TeacherPresenter.toResponse(
                result.getValue()
            );

            return HttpResultHandler.handle(Result.ok(transformed), 201);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       UPDATE
    ========================================================== */

    async update(id: string, req: NextRequest): Promise<Response> {
        try {
            const body = UpdateTeacherSchema.parse(await req.json());
            const result = await this.service.update({id, ...body});

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            const transformed = TeacherPresenter.toResponse(
                result.getValue()
            );

            return HttpResultHandler.handle(Result.ok(transformed));
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       DELETE
    ========================================================== */

    async delete(id: string): Promise<Response> {
        const result = await this.service.delete(id);
        return HttpResultHandler.handle(result);
    }


    /**
     * ============================================================
     * ASSIGN ROLE (BULK ONLY)
     * ============================================================
     *
     * POST /api/teachers/assign-role
     *
     * Body:
     * {
     *   teacherIds: string[],
     *   roles: TeacherRole[]
     * }
     *
     * Single assignment:
     * {
     *   teacherIds: ["id"],
     *   roles: [...]
     * }
     */
    async assignRoleBulk(req: NextRequest): Promise<Response> {
        try {
            const dto = AssignTeacherRoleBulkSchema.parse(
                await req.json()
            );

            const result = await this.service.assignRoleBulk(dto);

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }


    /**
     * ============================================================
     * ASSIGN HOMEROOM (BULK ONLY)
     * ============================================================
     *
     * POST /api/teachers/assign-homeroom
     *
     * Body:
     * {
     *   teacherIds: string[],
     *   rombelIds: string[]
     * }
     *
     * Single assignment:
     * {
     *   teacherIds: ["id"],
     *   rombelIds: ["classId"]
     * }
     */
    async assignHomeroomBulk(req: NextRequest): Promise<Response> {
        try {
            const dto = AssignHomeroomBulkSchema.parse(
                await req.json()
            );

            const result = await this.service.assignHomeroomBulk(dto);

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       SEARCH
    ========================================================== */

    async search(request: NextRequest): Promise<Response> {
        try {
            const {searchParams} = new URL(request.url);

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

            const transformed = {
                data: TeacherPresenter.toResponseList(value.data),
                total: value.total,
                page: value.page,
                limit: value.limit,
            };

            return HttpResultHandler.handle(Result.ok(transformed));
        } catch (error) {
            return handleZodError(error);
        }
    }

    /* ==========================================================
       IMPORT / EXPORT
    ========================================================== */

    /* ==========================================================
   IMPORT (EXCEL FILE)
========================================================== */

    async import(req: NextRequest): Promise<Response> {
        try {
            const formData = await req.formData();
            const file = formData.get("file") as File | null;

            if (!file) {
                return HttpResultHandler.handle(
                    Result.fail("File tidak ditemukan."),
                    400
                );
            }

            const buffer = new Uint8Array(await file.arrayBuffer());

            const rawRows = await this.excel.parse(buffer, {
                headerRow: 1,
                mapRow: (row) => row,
            });

            const mapped = this.mapper.toImportRows(rawRows);
            const validated = ImportTeacherSchema.parse(mapped);

            const result = await this.service.import(validated);

            return HttpResultHandler.handle(result);
        } catch (error) {
            return handleZodError(error);
        }
    }

    async export(request: NextRequest): Promise<Response> {
        const {searchParams} = new URL(request.url);
        const role = searchParams.get("role") ?? undefined;

        const result = await this.service.export({role});

        if (!result.isSuccess) {
            return HttpResultHandler.handle(result);
        }

        const mapped = this.mapper.toExportRows(result.getValue());

        type Row = (typeof mapped)[number];

        const columns: {
            header: string;
            key: keyof Row;
            width?: number;
        }[] = [
            {header: "NAME", key: "NAME"},
            {header: "NIP", key: "NIP"},
            {header: "NUPTK", key: "NUPTK"},
            {header: "NRK", key: "NRK"},
            {header: "NRG", key: "NRG"},
            {header: "GENDER", key: "GENDER"},
            {header: "RELIGION", key: "RELIGION"},
            {header: "PHONE", key: "PHONE"},
            {header: "EMAIL", key: "EMAIL"},
            {header: "EDUCATION", key: "EDUCATION"},
            {header: "MAJOR", key: "MAJOR"},
            {header: "GRADUATION_YEAR", key: "GRADUATION_YEAR"},
            {header: "BIRTH_PLACE", key: "BIRTH_PLACE"},
            {header: "BIRTH_DATE", key: "BIRTH_DATE"},
            {header: "RANK", key: "RANK"},
            {header: "ROLES", key: "ROLES"},
            {header: "IS_PNS", key: "IS_PNS"},
        ];

        const buffer = await this.excel.export({
            sheetName: "Teachers",
            columns,
            data: mapped,
        });

        return new Response(new Uint8Array(buffer), {
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition":
                    "attachment; filename=teachers.xlsx",
            },
        });
    }

    async importTemplate(): Promise<Response> {
        try {
            const buffer = await TeacherImportTemplateBuilder.build();

            // 🔥 Convert Buffer → Uint8Array
            const uint8 = new Uint8Array(buffer);

            return new NextResponse(uint8, {
                status: 200,
                headers: {
                    "Content-Type":
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition":
                        "attachment; filename=teacher-import-template.xlsx",
                    "Cache-Control": "no-store",
                },
            });

        } catch (err) {
            const apiError = toApiError(
                err,
                "Gagal membuat template import guru."
            );

            return NextResponse.json(apiError, {
                status: apiError.statusCode,
            });
        }
    }
}
