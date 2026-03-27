//Files: src/app/api/students/[id]/aid/route.ts

import { NextRequest } from "next/server";

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider";

import { RouteParamHelper }
    from "@/modules/shared/http/RouteParamHelper";

/**
 * ============================================================
 * STUDENT AID ROUTE
 * ============================================================
 *
 * API route responsible for delegating student aid requests
 * to the StudentChildRouter.
 *
 * Endpoints:
 *
 * GET    /api/students/:id/aid
 * POST   /api/students/:id/aid
 * PATCH  /api/students/:id/aid
 */

const router = StudentProvider.childRouter();

/**
 * ============================================================
 * GET STUDENT AID
 * ============================================================
 *
 * Retrieve aid records belonging to a student.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params);

    return router.getStudentAid(
        req,
        studentId
    );

}

/**
 * ============================================================
 * ASSIGN STUDENT AID
 * ============================================================
 *
 * Assign government aid to a student.
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params);

    return router.createStudentAid(
        req,
        studentId
    );

}

/**
 * ============================================================
 * UPDATE STUDENT AID
 * ============================================================
 *
 * Update an existing student aid record.
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params);

    return router.updateStudentAid(
        req,
        studentId
    );

}