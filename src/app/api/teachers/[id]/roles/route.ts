//Files: src/app/api/teachers/[id]/roles/route.ts
import type { NextRequest } from "next/server";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";
import { createTeacherController } from "@/app/api/teachers/_factory";

const controller = createTeacherController();

/**
 * =====================================================
 * PUT /api/teachers/:id/assign-role
 * =====================================================
 *
 * RbacConfig handled in middleware
 */

export async function PUT(req: NextRequest) {
    const id = getRouteParam(req);
    return controller.assignRole(id, req);
}
