//Files: src/app/api/students/[id]/counseling/route.ts
import { NextRequest } from "next/server"

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider"

import { RouteParamHelper }
    from "@/modules/shared/http/RouteParamHelper"

/**
 * ============================================================
 * STUDENT COUNSELING ROUTE
 * ============================================================
 *
 * Endpoint:
 *
 * POST /api/students/:id/counseling
 */

const router = StudentProvider.childRouter()

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params)

    return router.openStudentCounselingCase(
        req,
        studentId
    )

}