//Files: src/app/api/auth/refresh/route.ts

/**
 * =====================================================
 * REFRESH ROUTE
 * POST /api/auth/refresh
 * =====================================================
 */

import { NextRequest } from "next/server";
import {buildAuthController} from "@/app/api/auth/authFactory";

export async function POST(req: NextRequest) {
    const controller = buildAuthController();
    return controller.refresh(req);
}
