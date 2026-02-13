//Files: src/app/api/api/rombels/[id]/route.ts
import type { NextRequest } from "next/server";
import { createRombelController } from "../_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createRombelController();

/**
 * =====================================================
 * GET    /api/rombels/:id
 * PUT    /api/rombels/:id
 * DELETE /api/rombels/:id
 * =====================================================
 *
 * RBAC handled in middleware
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
