//Files: src/app/api/auth/login/route.ts

/**
 * =====================================================
 * LOGIN ROUTE
 * POST /api/auth/login
 * =====================================================
 */

import type { NextRequest } from "next/server";
import { buildAuthController } from "@/app/api/auth/authFactory";

export async function POST(req: NextRequest) {
  const controller = buildAuthController();
  return controller.login(req);
}
