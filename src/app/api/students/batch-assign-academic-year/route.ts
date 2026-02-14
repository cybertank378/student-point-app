//Files: src/app/api/students/batch-assign-academic-year/route.ts

import { createStudentController } from "@/app/api/students/_factory";
import type { NextRequest } from "next/server";

const controller = createStudentController();

/**
 * =====================================================
 * POST   /api/students/batch-assign-academic-year
 * =====================================================
 *
 * RbacConfig & Ownership handled in middleware / policy layer
 */
export async function POST(req: NextRequest) {
  return controller.batchAssignAcademicYear(req);
}
