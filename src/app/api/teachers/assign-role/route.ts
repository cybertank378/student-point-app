//Files: src/app/api/teachers/[id]/roles/route.ts

import {createTeacherController} from "@/app/api/teachers/_factory";
import {NextRequest} from "next/server";

/**
 * ============================================================
 * TEACHER ROLE ROUTE
 * ============================================================
 *
 * Endpoint:
 * - POST /api/teachers/assign-role
 * Body:
 * {
 *   teacherIds: string[],
 *   roles: TeacherRole[]
 * }
 *
 * Digunakan untuk memperbarui role guru.
 */

const controller = createTeacherController();

export async function POST(req: NextRequest) {
    return controller.assignRoleBulk(req);
}