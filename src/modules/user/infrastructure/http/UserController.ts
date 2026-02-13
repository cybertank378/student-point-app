//Files: src/modules/user/infrastructure/http/UserController.ts

import {CreateUserSchema, UpdateUserSchema} from "@/modules/user/infrastructure/validators/user.validator";
import {NextRequest} from "next/server";
import {UserService} from "@/modules/user/application/services/UserServices";
import {handleZodError} from "@/modules/shared/errors/handleZodError";

/**
 * UserController
 * --------------
 * HTTP Adapter for AuthUser module
 *
 * NOTE:
 * - RBAC handled at route level
 * - Controller hanya:
 *   - parsing
 *   - validation
 *   - HTTP <-> service mapping
 */
export class UserController {
    constructor(
        private readonly service: UserService,
    ) {}

    /**
     * ======================================
     * ============ LIST USERS ==============
     * ======================================
     * GET /api/users
     */
    async getAll() {
        const result = await this.service.list();

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
     * GET /api/users/:id
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
     * POST /api/users
     */
    async create(req: NextRequest) {
        try {
            const body = CreateUserSchema.parse(
                await req.json(),
            );

            const result =
                await this.service.create(body);

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

    /**
     * ======================================
     * ============== UPDATE ===============
     * ======================================
     * PUT /api/users/:id
     */
    async update(
        id: string,
        req: NextRequest,
    ) {
        try {
            const body = UpdateUserSchema.parse(
                await req.json(),
            );

            const result =
                await this.service.update({
                    id,
                    ...body,
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
     * ============== DELETE ===============
     * ======================================
     * DELETE /api/users/:id
     *
     * Soft delete (isActive = false)
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