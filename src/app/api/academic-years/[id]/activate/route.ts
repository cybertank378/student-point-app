//Files: src/app/api/academic-years/[id]/activate/route.ts

import type { NextRequest } from "next/server";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";
import { createAcademicYearController } from "@/app/api/academic-years/_factory";

/**
 * =====================================================
 * PATCH /api/academic-years/:id/activate
 * =====================================================
 *
 * RBAC handled in middleware
 */

export async function PATCH(req: NextRequest) {
    const id = getRouteParam(req);

    const controller = createAcademicYearController();
    return controller.setActive(id);
}
