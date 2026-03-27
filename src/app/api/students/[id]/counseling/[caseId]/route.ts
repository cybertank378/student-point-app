//Files: src/app/api/students/[id]/counseling/[caseId]/route.ts
import { NextRequest } from "next/server"

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider"

import { RouteParamHelper }
    from "@/modules/shared/http/RouteParamHelper"

/**
 * ============================================================
 * UPDATE STUDENT COUNSELING CASE ROUTE
 * ============================================================
 *
 * Endpoint:
 *
 * PATCH /api/students/:id/counseling/:caseId
 */

const router = StudentProvider.childRouter()

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; caseId: string }> }
): Promise<Response> {

    const caseId =
        await RouteParamHelper.param(
            params,
            "caseId"
        )

    return router.updateStudentCounselingCase(
        req,
        caseId
    )

}