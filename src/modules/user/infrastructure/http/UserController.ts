// Files: src/modules/user/infrastructure/http/UserController.ts

import { NextResponse } from "next/server";
import { handleZodError } from "@/modules/shared/errors/handleZodError";
import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";

import {
    ListUserSchema,
    CreateUserSchema,
    UpdateUserSchema,
} from "@/modules/user/infrastructure/validators/user.validator";

import { UserService } from "@/modules/user/application/services/UserServices";
import { UserPresenter } from "@/modules/user/presentation/presenters/UserPresenter";

import type { UpdateUserDTO } from "@/modules/user/domain/dto/UpdateUserDTO";
import type {
    UserSearchParams,
} from "@/modules/user/domain/interfaces/UserInterface";

import { TeacherRole, UserRole } from "@/libs/utils";
import { serverLog } from "@/libs/serverLogger";

/**
 * ============================================================
 * USER CONTROLLER
 * ============================================================
 *
 * HTTP Adapter for User module.
 *
 * Responsibilities:
 * - Parse HTTP request
 * - Validate using Zod
 * - Delegate to UserService
 * - Transform via Presenter
 * - Return standardized HTTP response
 *
 * No business logic here.
 * ============================================================
 */
export class UserController {
    constructor(private readonly service: UserService) {}

    /* =========================================================
       LIST USER
    ========================================================= */
    async list(request: Request) {
        try {
            const { searchParams } = new URL(request.url);

            const parsed = ListUserSchema.parse({
                page: searchParams.get("page"),
                limit: searchParams.get("limit"),
                search: searchParams.get("search") ?? undefined,
            });

            const result = await this.service.list(parsed);

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            const value = result.getValue();

            return NextResponse.json(
                {
                    data: UserPresenter.toResponseList(value.data),
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

    /* =========================================================
       GET USER BY ID
    ========================================================= */
    async findById(id: string) {
        if (!id) {
            return NextResponse.json(
                { message: "ID wajib diisi." },
                { status: 400 }
            );
        }

        const result = await this.service.findById(id);

        if (!result.isSuccess) {
            return HttpResultHandler.handle(result);
        }

        return NextResponse.json(
            UserPresenter.toResponse(result.getValue()),
            { status: 200 }
        );
    }

    /* =========================================================
       CREATE USER
    ========================================================= */
    async create(request: Request) {
        try {
            const body = await request.json();
            const parsed = CreateUserSchema.parse(body);

            const result = await this.service.create(parsed);

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            return NextResponse.json(
                UserPresenter.toResponse(result.getValue()),
                { status: 201 }
            );

        } catch (error) {
            return handleZodError(error);
        }
    }

    /* =========================================================
       UPDATE USER
    ========================================================= */
    async update(request: Request, id: string) {
        if (!id) {
            return NextResponse.json(
                { message: "ID wajib diisi." },
                { status: 400 }
            );
        }

        try {
            const body = await request.json();
            const parsed = UpdateUserSchema.parse(body);

            const dto: UpdateUserDTO = {
                id,
                ...parsed,
            };

            const result = await this.service.update(dto);

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            return NextResponse.json(
                UserPresenter.toResponse(result.getValue()),
                { status: 200 }
            );

        } catch (error) {
            return handleZodError(error);
        }
    }

    /* =========================================================
       DELETE USER
    ========================================================= */
    async delete(id: string) {
        if (!id) {
            return NextResponse.json(
                { message: "ID wajib diisi." },
                { status: 400 }
            );
        }

        const result = await this.service.delete(id);

        if (!result.isSuccess) {
            return HttpResultHandler.handle(result);
        }

        return NextResponse.json(
            { message: "User berhasil dihapus." },
            { status: 200 }
        );
    }

    /* =========================================================
       GET USER STATS
    ========================================================= */
    async getStats() {
        const result = await this.service.getStats();

        if (!result.isSuccess) {
            return HttpResultHandler.handle(result);
        }

        return NextResponse.json(
            result.getValue(),
            { status: 200 }
        );
    }

    /* =========================================================
       SEARCH USER
    ========================================================= */
    async search(request: Request) {
        try {
            const { searchParams } = new URL(request.url);

            const params: UserSearchParams = {
                page: Number(searchParams.get("page") ?? 1),
                limit: Number(searchParams.get("limit") ?? 10),
                username: searchParams.get("username") ?? undefined,
                role: searchParams.get("role") as UserRole,
                isActive:
                    searchParams.get("isActive") !== null
                        ? searchParams.get("isActive") === "true"
                        : undefined,
                teacherRole:
                    searchParams.get("teacherRole") as TeacherRole,
                createdFrom: searchParams.get("createdFrom")
                    ? new Date(searchParams.get("createdFrom")!)
                    : undefined,
                createdTo: searchParams.get("createdTo")
                    ? new Date(searchParams.get("createdTo")!)
                    : undefined,
                sortBy:
                    (searchParams.get("sortBy") as
                        | "createdAt"
                        | "username") ?? "createdAt",
                sortOrder:
                    (searchParams.get("sortOrder") as
                        | "asc"
                        | "desc") ?? "desc",
            };

            const result = await this.service.search(params);

            if (!result.isSuccess) {
                return HttpResultHandler.handle(result);
            }

            const value = result.getValue();

            return NextResponse.json(
                {
                    data: UserPresenter.toResponseList(value.data),
                    total: value.total,
                    page: value.page,
                    limit: value.limit,
                },
                { status: 200 }
            );

        } catch (error) {
            serverLog("Search Controller Error:", error);
            return NextResponse.json(
                { message: "Terjadi kesalahan pada server." },
                { status: 500 }
            );
        }
    }
}