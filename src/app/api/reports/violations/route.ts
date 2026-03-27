//Files: src/app/api/reports/violations/route.ts
import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * VIOLATION STATISTICS ROUTE
 * ============================================================
 *
 * GET /api/reports/violations
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.violationStatistic(req);
}
