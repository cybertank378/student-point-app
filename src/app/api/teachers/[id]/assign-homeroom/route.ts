//Files: src/app/api/teachers/[id]/assign-homeroom/route.ts
import type { NextRequest } from "next/server";
import { createTeacherController } from "@/app/api/teachers/_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createTeacherController();

/**
 * =====================================================
 * PUT /api/teachers/:id/assign-homeroom
 * =====================================================
 *
 * RbacConfig handled in middleware
 */

export async function PUT(req: NextRequest) {
    const id = getRouteParam(req);
    return controller.assignHomeroom(id, req);
}
