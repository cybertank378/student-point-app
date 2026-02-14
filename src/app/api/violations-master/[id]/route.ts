//Files: src/app/api/violations-master/[id]/route.ts
import type { NextRequest } from "next/server";
import { createViolationController } from "../_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createViolationController();

/**
 * =====================================================
 * GET    /api/violations-master/:id
 * PUT    /api/violations-master/:id
 * DELETE /api/violations-master/:id
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
