//Files: src/app/api/auth/logout/route.ts

/**
 * =====================================================
 * LOGOUT ROUTE
 * POST /api/auth/logout
 * =====================================================
 */

import { NextRequest } from "next/server";
import {buildAuthController} from "@/app/api/auth/authFactory";

export async function POST(req: NextRequest) {
    const controller = buildAuthController();
    return controller.logout(req);
}
