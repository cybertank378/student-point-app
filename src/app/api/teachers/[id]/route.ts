//Files: src/app/api/teachers/[id]/route.ts
import type { NextRequest } from "next/server";
import { createTeacherController } from "../_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createTeacherController();

/**
 * =====================================================
 * GET    /api/teachers/:id
 * PUT    /api/teachers/:id
 * DELETE /api/teachers/:id
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
