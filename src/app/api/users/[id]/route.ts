//Files: src/app/api/users/[id]/route.ts
import type { NextRequest } from "next/server";
import { createUserController } from "../_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createUserController();

/**
 * =====================================================
 * GET    /api/users/:id
 * PUT    /api/users/:id
 * DELETE /api/users/:id
 * =====================================================
 *
 * RbacConfig handled in middleware
 */

export async function GET(req: NextRequest) {
    const id = getRouteParam(req);
    return controller.getById(id);
}

export async function PUT(req: NextRequest) {
    const id = getRouteParam(req);
    return controller.update(id, req);
}

export async function DELETE(req: NextRequest) {
    const id = getRouteParam(req);
    return controller.delete(id);
}
