//Files: src/app/api/teachers/[id]/roles/route.ts

import {createTeacherController} from "@/app/api/teachers/_factory";
import {NextRequest} from "next/server";

/**
 * ============================================================
 * TEACHER ROLE ROUTE
 * ============================================================
 *
 * Endpoint:
 * - PATCH /api/teachers/:id/roles
 *
 * Digunakan untuk memperbarui role guru.
 */

const controller = createTeacherController();

/**
 * PUT /api/teachers/:id/role
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<Response> {
    const { id } = await context.params;

    return controller.assignRole(id, request);
}