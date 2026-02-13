//Files: src/app/api/students/route.ts
import type { NextRequest } from "next/server";
import { createStudentController } from "./_factory";

const controller = createStudentController();

/**
 * =====================================================
 * GET  /api/students
 * POST /api/students
 * =====================================================
 *
 * RBAC handled in middleware
 */

export async function GET(req: NextRequest) {
    return controller.getAll(req);
}

export async function POST(req: NextRequest) {
    return controller.create(req);
}
