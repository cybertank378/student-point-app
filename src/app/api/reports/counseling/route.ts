//Files: src/app/api/reports/counseling/route.ts
import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * COUNSELING STATISTICS ROUTE
 * ============================================================
 *
 * GET /api/reports/counseling
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.counselingStatistic(req);
}
