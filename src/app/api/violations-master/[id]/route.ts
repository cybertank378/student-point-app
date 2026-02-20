// Files: src/app/api/violations-master/[id]/route.ts

import type { NextRequest } from "next/server";
import { createViolationController } from "../_factory";

/**
 * ============================================================
 * NEXT.JS 15+ COMPATIBLE ROUTE HANDLER
 * ============================================================
 *
 * IMPORTANT:
 * In Next.js 15+, `params` is now a Promise.
 *
 * Therefore:
 * - Do NOT destructure params directly
 * - Await context.params first
 *
 * This prevents RouteHandlerConfig type errors.
 * ============================================================
 */

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;

    const controller = createViolationController();
    return controller.findById(id);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;

    const controller = createViolationController();
    return controller.update(request, id);
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;

    const controller = createViolationController();
    return controller.delete(id);
}