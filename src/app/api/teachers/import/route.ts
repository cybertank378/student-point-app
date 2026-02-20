//Files: src/app/api/teachers/import/route.ts

import { NextRequest } from "next/server";
import {createTeacherController} from "@/app/api/teachers/_factory";

/**
 * ============================================================
 * TEACHER IMPORT ROUTE
 * ============================================================
 *
 * Endpoint: /api/teachers/import
 *
 * Method:
 * - POST
 *
 * Digunakan untuk bulk import teacher (CSV/Excel).
 */

const controller = createTeacherController();

/**
 * POST /api/teachers/import
 */
export async function POST(request: NextRequest) {
    return controller.import(request);
}
