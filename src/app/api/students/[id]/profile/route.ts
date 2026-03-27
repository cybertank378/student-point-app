// Files: src/app/api/students/[id]/violation/route.ts

import { NextRequest } from "next/server"

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider"

import { RouteParamHelper }
    from "@/modules/shared/http/RouteParamHelper"

const router = StudentProvider.childRouter()

/**
 * ============================================================
 * GET /api/students/:id/profile
 * ============================================================
 *
 * Retrieve student profile information.
 *
 * @param req - Incoming HTTP request
 * @param context - Next.js route context containing params
 *
 * @returns HTTP response containing student profile data
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const id = await RouteParamHelper.id(params)

    return router.getProfile(req, id)

}

/**
 * ============================================================
 * PATCH /api/students/:id/profile
 * ============================================================
 *
 * Update student profile data.
 *
 * @param req - Incoming HTTP request
 * @param context - Next.js route context containing params
 *
 * @returns HTTP response indicating update result
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const id = await RouteParamHelper.id(params)

    return router.updateProfile(req, id)

}

/**
 * ============================================================
 * DELETE /api/students/:id/profile
 * ============================================================
 *
 * Delete student profile data.
 *
 * @param req - Incoming HTTP request
 * @param context - Next.js route context containing params
 *
 * @returns HTTP response indicating deletion result
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const id = await RouteParamHelper.id(params)

    return router.deleteProfile(req, id)

}