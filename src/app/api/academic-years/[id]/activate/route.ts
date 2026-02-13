//Files: src/app/api/academic-years/[id]/activate/route.ts

import { createAcademicYearController } from "@/app/api/academic-years/_factory";

/**
 * =====================================================
 * PATCH /api/academic-years/:id/activate
 * =====================================================
 *
 * RBAC handled in middleware
 */

export async function PATCH(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const controller = createAcademicYearController();

    return await controller.setActive(id);
}