//Files: src/app/api/students/assign-academic-year/route.ts

import type { NextRequest } from "next/server";
import { createStudentController } from "@/app/api/students/_factory";

const controller = createStudentController();

/**
 * =====================================================
 * POST   /api/students/assign-academic-year
 * =====================================================
 *
 * RbacConfig & Ownership handled in middleware / policy layer
 */

export async function POST(req: NextRequest) {
  return controller.assignAcademicYear(req);
}
