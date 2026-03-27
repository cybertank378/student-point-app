//Files: src/app/api/achievements-master/route.ts

import type { NextRequest } from "next/server";
import { createAchievementController } from "./_factory";
import {createViolationController} from "@/app/api/violations-master/_factory";

const controller = createAchievementController();

/**
 * =====================================================
 * GET  /api/achievements-master
 * POST /api/achievements-master
 * =====================================================
 *
 * RbacConfig handled in middleware
 */

export async function GET(request: Request) {
    return controller.getAll(request);
}

export async function POST(req: NextRequest) {
    return controller.create(req);
}
