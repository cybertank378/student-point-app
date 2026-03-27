//Files: src/app/api/reports/students/gender/route.ts
import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * STUDENT GENDER STATISTICS ROUTE
 * ============================================================
 *
 * GET /api/reports/students/gender
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.genderStatistic(req);
}
