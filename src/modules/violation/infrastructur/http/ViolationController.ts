// Files: src/modules/violation/infrastructure/http/ViolationController.ts

import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { ViolationService } from "@/modules/violation/application/services/ViolationService";
import type { BasePaginationParams } from "@/modules/shared/http/pagination/BasePagination";
import { getQueryParam } from "@/modules/shared/http/QueryParams";

/**
 * ============================================================
 * VIOLATION CONTROLLER
 * ============================================================
 *
 * HTTP Adapter for Violation module.
 *
 * Responsibilities:
 * - Parse HTTP request
 * - Normalize query params
 * - Delegate to service
 * - Let HttpResultHandler handle response mapping
 *
 * No manual NextResponse.json here.
 * ============================================================
 */
export class ViolationController {
    constructor(private readonly service: ViolationService) {}

    /* =========================================================
       LIST (PAGINATED)
    ========================================================= */

    async list(request: Request) {
        const { searchParams } = new URL(request.url);

        const params: BasePaginationParams = {
            page: getQueryParam(searchParams.get("page"))
                ? Number(getQueryParam(searchParams.get("page")))
                : undefined,
            limit: getQueryParam(searchParams.get("limit"))
                ? Number(getQueryParam(searchParams.get("limit")))
                : undefined,
            search: getQueryParam(searchParams.get("search")),
            sortBy: getQueryParam(searchParams.get("sortBy")),
            sortOrder: getQueryParam(
                searchParams.get("sortOrder"),
            ) as "asc" | "desc" | undefined,
        };

        const result = await this.service.list(params);

        return HttpResultHandler.handle(result);
    }

    /* =========================================================
       GET BY ID
    ========================================================= */

    async findById(id: string) {
        const result = await this.service.findById(id);

        return HttpResultHandler.handle(result);
    }

    /* =========================================================
       CREATE
    ========================================================= */

    async create(request: Request) {
        const body = await request.json();

        const result = await this.service.create(body);

        return HttpResultHandler.handle(result, 201);
    }

    /* =========================================================
       UPDATE
    ========================================================= */

    async update(request: Request, id: string) {
        const body = await request.json();

        const result = await this.service.update({
            id,
            ...body,
        });

        return HttpResultHandler.handle(result);
    }

    /* =========================================================
       DELETE
    ========================================================= */

    async delete(id: string) {
        const result = await this.service.delete(id);

        return HttpResultHandler.handle(result);
    }
}