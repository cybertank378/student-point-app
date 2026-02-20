//Files: src/app/api/teachers/[id]/route.ts

import {createTeacherController} from "@/app/api/teachers/_factory";
import {NextRequest} from "next/server";


/**
 * ============================================================
 * TEACHER DETAIL ROUTE
 * ============================================================
 *
 * Endpoint: /api/teachers/:id
 *
 * Supported Methods:
 * - GET → Get teacher by ID
 * - PUT → Update teacher
 * - DELETE → Delete teacher
 */

const controller = createTeacherController();

/**
 * ============================================================
 * GET /api/teachers/:id
 * ------------------------------------------------------------
 * Mengambil detail guru berdasarkan ID.
 *
 * Response:
 * 200 → Teacher detail
 * 404 → Not found
 */
export async function GET(
    _: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;

    return controller.getById(id);
}

/**
 * ============================================================
 * PATCH /api/teachers/:id
 * ------------------------------------------------------------
 * Memperbarui data guru.
 *
 * Body:
 * - UpdateTeacherDTO
 *
 * Response:
 * 200 → Updated teacher
 * 400 → Validation error
 */
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
): Promise<Response> {
    const { id } = await context.params;

    return controller.update(id, request);
}
/**
 * ============================================================
 * DELETE /api/teachers/:id
 * ------------------------------------------------------------
 * Menghapus data guru secara permanen.
 *
 * Response:
 * 200 → Success
 * 404 → Not found
 */
export async function DELETE(
    _: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;

    return controller.delete(id);
}
