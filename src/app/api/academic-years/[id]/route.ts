//Files: src/app/api/academic-years/[id]/route.ts
import type { NextRequest } from "next/server";
import { createAcademicYearController } from "../_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createAcademicYearController();

/**
 * =====================================================
 * GET    /api/academic-years/:id
 * PUT    /api/academic-years/:id
 * DELETE /api/academic-years/:id
 * =====================================================
 */

export async function GET(req: NextRequest) {
    const id = getRouteParam(req);
    return await controller.getById(id);
}

export async function PUT(req: NextRequest) {
    const id = getRouteParam(req);
    return await controller.update(id, req);
}

export async function DELETE(req: NextRequest) {
    const id = getRouteParam(req);
    return await controller.delete(id);
}

