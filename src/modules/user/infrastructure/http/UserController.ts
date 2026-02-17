//Files: src/modules/user/infrastructure/http/UserController.ts
import { NextResponse } from "next/server";
import { handleZodError } from "@/modules/shared/errors/handleZodError";

import {
    ListUserSchema,
    CreateUserSchema,
    UpdateUserSchema,
} from "@/modules/user/infrastructure/validators/user.validator";

import { UserService } from "@/modules/user/application/services/UserServices";
import { UserPresenter } from "@/modules/user/presentation/presenters/UserPresenter";
import {TeacherRole, UserRole} from "@/libs/utils";
import {serverLog} from "@/libs/serverLogger";
import {UpdateUserDTO} from "@/modules/user/domain/dto/UpdateUserDTO";

export class UserController {
    constructor(private readonly service: UserService) {}

    /**
     * =====================================================
     * LIST USER
     * =====================================================
     */
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
                return NextResponse.json(
                    { message: result.getError() },
                    { status: 400 },
                );
            }

            const value = result.getValue();

            return NextResponse.json(
                {
                    data: UserPresenter.toResponseList(value.data),
                    total: value.total,
                    page: value.page,
                    limit: value.limit,
                },
                { status: 200 },
            );
        } catch (error) {
            return handleZodError(error);
        }
    }

    /**
     * =====================================================
     * GET USER BY ID
     * =====================================================
     */
    async findById(id: string) {
        if (!id) {
            return NextResponse.json(
                { message: "ID wajib diisi." },
                { status: 400 },
            );
        }

        const result = await this.service.findById(id);

        if (!result.isSuccess) {
            return NextResponse.json(
                { message: result.getError() },
                { status: 404 },
            );
        }

        return NextResponse.json(
            UserPresenter.toResponse(result.getValue()),
            { status: 200 },
        );
    }

    /**
     * =====================================================
     * CREATE USER
     * =====================================================
     */
    async create(request: Request) {
        try {
            const body = await request.json();
            const parsed = CreateUserSchema.parse(body);

            const result = await this.service.create(parsed);

            if (!result.isSuccess) {
                return NextResponse.json(
                    { message: result.getError() },
                    { status: 400 },
                );
            }

            return NextResponse.json(
                UserPresenter.toResponse(result.getValue()),
                { status: 201 },
            );
        } catch (error) {
            return handleZodError(error);
        }
    }

    /**
     * =====================================================
     * UPDATE USER
     * =====================================================
     */
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
                return NextResponse.json(
                    { message: result.getError() },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                UserPresenter.toResponse(result.getValue()),
                { status: 200 }
            );
        } catch (error) {
            return handleZodError(error);
        }
    }




    /**
     * =====================================================
     * DELETE USER
     * =====================================================
     */
    async delete(id: string) {
        if (!id) {
            return NextResponse.json(
                { message: "ID wajib diisi." },
                { status: 400 },
            );
        }

        const result = await this.service.delete(id);

        if (!result.isSuccess) {
            return NextResponse.json(
                { message: result.getError() },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { message: "User berhasil dihapus." },
            { status: 200 },
        );
    }

    /**
     * =====================================================
     * GET USER STATISTICS (DASHBOARD)
     * =====================================================
     */
    async getStats() {
        const result = await this.service.getStats();

        if (!result.isSuccess) {
            return NextResponse.json(
                { message: result.getError() },
                { status: 500 },
            );
        }

        return NextResponse.json(
            result.getValue(),
            { status: 200 },
        );
    }

    /**
     * =====================================================
     * SEARCH USER (ADVANCED)
     * =====================================================
     */
    async search(request: Request) {
        try {
            const { searchParams } = new URL(request.url);

            const page = Number(searchParams.get("page") ?? 1);
            const limit = Number(searchParams.get("limit") ?? 10);

            const username = searchParams.get("username") ?? undefined;
            const role = searchParams.get("role") ?? undefined;
            const isActiveParam = searchParams.get("isActive");
            const teacherRole = searchParams.get("teacherRole") ?? undefined;

            const createdFromParam = searchParams.get("createdFrom");
            const createdToParam = searchParams.get("createdTo");

            const sortBy =
                (searchParams.get("sortBy") as "createdAt" | "username") ??
                "createdAt";

            const sortOrder =
                (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc";

            const isActive =
                isActiveParam !== null
                    ? isActiveParam === "true"
                    : undefined;

            const createdFrom = createdFromParam
                ? new Date(createdFromParam)
                : undefined;

            const createdTo = createdToParam
                ? new Date(createdToParam)
                : undefined;

            const result = await this.service.search({
                page,
                limit,
                username,
                role: role as UserRole,
                isActive,
                teacherRole: teacherRole as TeacherRole,
                createdFrom,
                createdTo,
                sortBy,
                sortOrder,
            });

            if (!result.isSuccess) {
                return NextResponse.json(
                    { message: result.getError() },
                    { status: 400 }
                );
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
            serverLog("Search Controller Error:", error)
            return NextResponse.json(
                { message: "Terjadi kesalahan pada server." },
                { status: 500 }
            );
        }
    }


}
