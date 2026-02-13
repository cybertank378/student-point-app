//Files: src/app/api/religions/[id]/route.ts
import type { NextRequest } from "next/server";
import { createReligionController } from "../_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createReligionController();

/**
 * =====================================================
 * GET    /api/religions/:id
 * PUT    /api/religions/:id
 * DELETE /api/religions/:id
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
