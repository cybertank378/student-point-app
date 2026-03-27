//Files: src/app/api/students/[id]/violation/[violationId]/resolve/route.ts

import { NextRequest } from "next/server"

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider"

/**
 * ============================================================
 * RESOLVE STUDENT VIOLATION ROUTE
 * ============================================================
 *
 * PATCH /api/violations/:violationId/resolve
 */

const router = StudentProvider.childRouter()

export async function PATCH(
    req: NextRequest,
    {
        params
    }: {
        params: Promise<{ violationId: string }>
    }
): Promise<Response> {

    const { violationId } =
        await params

    return router.resolveViolation(
        req,
        violationId
    )

}