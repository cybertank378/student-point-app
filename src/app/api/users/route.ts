//Files: src/app/api/users/route.ts

import type { NextRequest } from "next/server";
import { createUserController } from "./_factory";

const controller = createUserController();

/**
 * =====================================================
 * GET  /api/users
 * POST /api/users
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
