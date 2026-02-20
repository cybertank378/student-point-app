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
 * PATCH /api/teachers/:id/homeroom
 */
export async function PATCH(request: NextRequest) {
    return controller.assignHomeroom(request);
}