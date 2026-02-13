// Files: src/app/api/violations-master/route.ts
import type { NextRequest } from "next/server";
import { createViolationController } from "./_factory";

const controller = createViolationController();

/**
 * =====================================================
 * GET  /api/violations-master
 * POST /api/violations-master
 * =====================================================
 *
 * RBAC handled in middleware
 */

export async function GET() {
    return controller.getAll();
}

export async function POST(req: NextRequest) {
    return controller.create(req);
}
