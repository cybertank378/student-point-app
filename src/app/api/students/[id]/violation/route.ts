//Files: src/app/api/students/[id]/violation/route.ts

import { NextRequest } from "next/server"

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider"

import { RouteParamHelper }
    from "@/modules/shared/http/RouteParamHelper"

/**
 * ============================================================
 * STUDENT VIOLATIONS ROUTE
 * ============================================================
 *
 * GET /api/students/:id/violations
 * POST /api/students/:id/violations
 */

const router = StudentProvider.childRouter()

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params)

    return router.listViolations(
        req,
        studentId
    )

}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params)

    return router.recordViolation(
        req,
        studentId
    )

}


