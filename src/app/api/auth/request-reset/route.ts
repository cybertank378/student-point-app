//Files: src/app/api/auth/request-reset/route.ts

/**
 * =====================================================
 * REQUEST RESET PASSWORD ROUTE
 * POST /api/auth/request-reset
 * =====================================================
 */

import { NextRequest } from "next/server";
import {buildAuthController} from "@/app/api/auth/authFactory";

export async function POST(req: NextRequest) {
    const controller = buildAuthController();
    return controller.requestReset(req);
}
