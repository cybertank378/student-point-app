// Files: src/app/api/students/[id]/violation/history/route.ts

import { NextRequest } from "next/server"

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider"

import { RouteParamHelper }
    from "@/modules/shared/http/RouteParamHelper"


const router = StudentProvider.childRouter()

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params)

    const academicYearId =
        RouteParamHelper.query(req, "academicYearId")

    return router.violationHistory(
        req,
        studentId,
        academicYearId
    )

}