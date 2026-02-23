//Files: src/app/api/teachers/[id]/assign-homeroom/route.ts

import {createTeacherController} from "@/app/api/teachers/_factory";
import {NextRequest} from "next/server";

/**
 * ============================================================
 * TEACHER HOMEROOM ROUTE
 * ============================================================
 *
 * Endpoint:
 * - PATCH /api/teachers/:id/homeroom
 *
 * Digunakan untuk menetapkan guru sebagai wali kelas.
 */

const controller = createTeacherController();

/**
 * ============================================================
 * POST /api/teachers/assign-homeroom
 * ============================================================
 *
 * Body:
 * {
 *   teacherIds: string[],
 *   rombelIds: string[]
 * }
 */
export async function POST(req: NextRequest) {
    return controller.assignHomeroomBulk(req);
}