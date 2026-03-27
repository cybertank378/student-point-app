//Files: src/app/api/reports/students/route.ts
import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * STUDENT STATISTICS ROUTE
 * ============================================================
 *
 * GET /api/reports/students
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.studentStatistic(req);
}
