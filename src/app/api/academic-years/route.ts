import type { NextRequest } from "next/server";
import { createAcademicYearController } from "./_factory";

const controller = createAcademicYearController();

/**
 * =====================================================
 * GET  /api/academic-years
 * POST /api/academic-years
 * =====================================================
 */

export async function GET() {
    return await  controller.getAll();
}

export async function POST(req: NextRequest) {
    return await controller.create(req);
}
