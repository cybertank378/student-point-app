//Files: src/app/api/api/rombels/route.ts
import type { NextRequest } from "next/server";
import { createRombelController } from "./_factory";

const controller = createRombelController();

/**
 * =====================================================
 * GET  /api/rombels
 * POST /api/rombels
 * =====================================================
 *
 * RbacConfig handled in middleware
 */

export async function GET(req: NextRequest) {
    return await controller.getAll(req);
}

export async function POST(req: NextRequest) {
    return await controller.create(req);
}
