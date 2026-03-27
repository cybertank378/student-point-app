//Files: src/app/api/reports/classes/route.ts
import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * CLASS STATISTICS ROUTE
 * ============================================================
 *
 * GET /api/reports/classes
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.classStatistics(req);
}
