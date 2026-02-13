//Files: src/app/api/achievements-master/route.ts

import type { NextRequest } from "next/server";
import { createAchievementController } from "./_factory";

const controller = createAchievementController();

/**
 * =====================================================
 * GET  /api/achievements-master
 * POST /api/achievements-master
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
