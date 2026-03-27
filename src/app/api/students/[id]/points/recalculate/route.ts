//Files: src/app/api/students/[id]/points/recalculate/route.ts
import { NextRequest } from "next/server"

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider"

import { RouteParamHelper }
    from "@/modules/shared/http/RouteParamHelper"

/**
 * ============================================================
 * RECALCULATE STUDENT POINT ROUTE
 * ============================================================
 *
 * POST /api/students/:id/points/recalculate
 */

const router = StudentProvider.childRouter()

export async function POST(
    req: NextRequest,
    {
        params
    }: {
        params: Promise<{ id: string }>
    }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params)

    return router.recalculateStudentPoint(
        req,
        studentId
    )

}