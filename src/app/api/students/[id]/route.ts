//Files: src/app/api/students/[id]/route.ts

import type { NextRequest } from "next/server";
import { createStudentController } from "../_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createStudentController();

/**
 * =====================================================
 * GET    /api/students/:id
 * PUT    /api/students/:id
 * DELETE /api/students/:id
 * =====================================================
 *
 * RBAC & Ownership handled in middleware / policy layer
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
