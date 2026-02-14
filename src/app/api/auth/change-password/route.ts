//Files: src/app/api/auth/change-password/route.ts
/**
 * =====================================================
 * CHANGE PASSWORD ROUTE
 * POST /api/auth/change-password
 * =====================================================
 *
 * Authentication handled in middleware
 */

import { type NextRequest, NextResponse } from "next/server";
import { buildAuthController } from "@/app/api/auth/authFactory";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const controller = buildAuthController();

  return controller.changePassword(user.sub, req);
}
