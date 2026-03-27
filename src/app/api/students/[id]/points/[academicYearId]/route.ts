//Files: src/app/api/students/[id]/points/[academicYearId]/route.ts
import { NextRequest } from "next/server"

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider"

import { RouteParamHelper }
    from "@/modules/shared/http/RouteParamHelper"

/**
 * ============================================================
 * STUDENT POINT SUMMARY ROUTE
 * ============================================================
 *
 * GET /api/students/:id/points/:academicYearId
 */

const router = StudentProvider.childRouter()

export async function GET(
    req: NextRequest,
    {
        params
    }: {
        params: Promise<{
            id: string
            academicYearId: string
        }>
    }
): Promise<Response> {

    const { id, academicYearId } = await params

    const studentId =
        await RouteParamHelper.id(Promise.resolve({ id }))

    return router.getStudentPointSummary(
        req,
        studentId,
        academicYearId
    )

}

