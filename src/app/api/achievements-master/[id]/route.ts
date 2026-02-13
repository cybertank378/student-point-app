//Files: src/app/api/achievements-master/[id]/route.ts
import type { NextRequest } from "next/server";
import { createAchievementController } from "../_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createAchievementController();

/**
 * =====================================================
 * GET    /api/achievements-master/:id
 * PUT    /api/achievements-master/:id
 * DELETE /api/achievements-master/:id
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
