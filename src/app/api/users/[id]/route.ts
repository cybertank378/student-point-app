//Files: src/app/api/users/[id]/route.ts
// Files: src/app/api/users/[id]/route.ts

import { NextRequest } from "next/server";
import { userController } from "@/app/api/users/_factory";

/**
 * =====================================================
 * GET    /api/users/:id
 * PUT    /api/users/:id
 * DELETE /api/users/:id
 * =====================================================
 *
 * Next 16+:
 * params is Promise<{ id: string }>
 */

/* ================= GET ================= */

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    return userController.findById(id);
}

/* ================= PUT ================= */

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    return userController.update(request, id);
}

/* ================= DELETE ================= */

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    return userController.delete(id);
}
