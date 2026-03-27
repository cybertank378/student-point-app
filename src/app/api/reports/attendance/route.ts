//Files: src/app/api/reports/attendance/route.ts

import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * ATTENDANCE STATISTICS ROUTE
 * ============================================================
 *
 * GET /api/reports/attendance
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.attendanceStatistic(req);
}
