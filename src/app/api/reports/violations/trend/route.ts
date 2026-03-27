//Files: src/app/api/reports/violations/trend/route.ts

import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * VIOLATION TREND ROUTE
 * ============================================================
 *
 * GET /api/reports/violations/trend
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.violationTrend(req);
}
