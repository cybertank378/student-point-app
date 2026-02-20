//Files: src/app/api/teachers/[id]/roles/route.ts
import { NextRequest } from "next/server";
import {createTeacherController} from "@/app/api/teachers/_factory";

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
 * PATCH /api/teachers/:id/role
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return controller.assignRole(params.id, request);
}

