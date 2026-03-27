//Files: src/app/api/reports/students/disability/route.ts

import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * STUDENT DISABILITY STATISTICS ROUTE
 * ============================================================
 *
 * GET /api/reports/students/disability
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.disabilityStatistic(req);
}
