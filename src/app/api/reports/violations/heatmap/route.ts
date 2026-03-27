//Files: src/app/api/reports/violations/heatmap/route.ts

import type { NextRequest } from "next/server";

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * VIOLATION HEATMAP ROUTE
 * ============================================================
 *
 * GET /api/reports/violations/heatmap
 */

const router = StudentProvider.childRouter();

export async function GET(req: NextRequest): Promise<Response> {
  return router.violationHeatmap(req);
}
