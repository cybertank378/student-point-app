//Files: src/app/api/students/nis/[nis]/route.ts
import type {NextRequest} from "next/server";
import {createStudentController} from "@/app/api/students/_factory";
import {getRouteParam} from "@/modules/shared/http/getRouteParam";

const controller = createStudentController();

/**
 * =====================================================
 * GET /api/students/nis/:nis
 * =====================================================
 *
 * RbacConfig handled in middleware
 */

export async function GET(req: NextRequest) {
    const nisParam = getRouteParam(req);
    return controller.getByNis(nisParam);
}
