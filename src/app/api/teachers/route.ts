//Files: src/app/api/teachers/route.ts

import type { NextRequest } from "next/server";
import { createTeacherController } from "./_factory";

const controller = createTeacherController();

/**
 * =====================================================
 * GET  /api/teachers
 * POST /api/teachers
 * =====================================================
 *
 * RbacConfig handled in middleware
 */

export async function GET() {
    return controller.getAll();
}

export async function POST(req: NextRequest) {
    return controller.create(req);
}
