//Files: src/app/api/auth/reset-password/route.ts

/**
 * =====================================================
 * RESET PASSWORD ROUTE
 * POST /api/auth/reset-password
 * =====================================================
 */

import type { NextRequest } from "next/server";
import { buildAuthController } from "@/app/api/auth/authFactory";

export async function POST(req: NextRequest) {
  const controller = buildAuthController();
  return controller.resetPassword(req);
}
