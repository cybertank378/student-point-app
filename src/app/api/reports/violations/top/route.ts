//Files: src/app/api/reports/violations/top/route.ts
import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * TOP VIOLATION STUDENTS ROUTE
 * ============================================================
 *
 * GET /api/reports/violations/top?limit=10
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.topViolationStudents(req);
}
