//Files: src/app/api/students/nis/[nis]/route.ts
import type { NextRequest } from "next/server";
import { createStudentController } from "@/app/api/students/_factory";
import { getRouteParam } from "@/modules/shared/http/getRouteParam";

const controller = createStudentController();

/**
 * =====================================================
 * GET /api/students/nis/:nis
 * =====================================================
 *
 * RBAC handled in middleware
 */

export async function GET(req: NextRequest) {
    const nisParam = getRouteParam(req);
    const nis = Number(nisParam);

    if (Number.isNaN(nis)) {
        return Response.json(
            { message: "Invalid NIS" },
            { status: 400 }
        );
    }

    return controller.getByNis(nis);
}
