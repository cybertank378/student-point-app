//Files: src/app/api/students/statistics/route.ts
import type { NextRequest } from "next/server";
import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * Student Statistics Route
 *
 * Route handler untuk mengambil statistik siswa
 * yang digunakan oleh dashboard.
 *
 * Dependency controller disediakan oleh
 * StudentProvider sebagai composition root.
 */

const controller = StudentProvider.controller();

/**
 * ============================================================
 * GET STUDENT STATISTICS
 * ============================================================
 *
 * Mengambil statistik siswa untuk dashboard.
 *
 * ------------------------------------------------------------
 * RETURNS
 * ------------------------------------------------------------
 *
 * @returns {Promise<Response>}
 *
 * ------------------------------------------------------------
 * EXAMPLE
 * ------------------------------------------------------------
 *
 * GET /api/students/statistics
 */

export async function GET(_request: NextRequest): Promise<Response> {
  return controller.statistics();
}
