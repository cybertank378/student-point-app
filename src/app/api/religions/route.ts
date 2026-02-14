//Files: src/app/api/religions/route.ts
import type { NextRequest } from "next/server";
import { createReligionController } from "@/app/api/religions/_factory";

const controller = createReligionController();

/**
 * =====================================================
 * GET  /api/religions
 * POST /api/religions
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
