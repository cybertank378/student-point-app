//Files: src/app/api/students/[id]/achievements/[achievementId]/route.ts

import { NextRequest } from "next/server";

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider";
import {RouteParamHelper} from "@/modules/shared/http/RouteParamHelper";

/**
 * ============================================================
 * STUDENT ACHIEVEMENT DETAIL ROUTE
 * ============================================================
 *
 * API route responsible for delegating student achievement
 * detail requests to the StudentChildRouter.
 *
 * Endpoints:
 *
 * GET     /api/students/:id/achievements/:achievementId
 * DELETE  /api/students/:id/achievements/:achievementId
 */

const router = StudentProvider.childRouter();

/**
 * ============================================================
 * GET STUDENT ACHIEVEMENT
 * ============================================================
 */

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; achievementId: string }> }
): Promise<Response> {
    const studentId = await RouteParamHelper.id(params)

    const achievementId = await RouteParamHelper.param( params, "achievementId")

    return router.getStudentAchievement(
        req,
        studentId,
        achievementId
    )
}

/**
 * ============================================================
 * DELETE STUDENT ACHIEVEMENT
 * ============================================================
 */

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ achievementId: string }> }
): Promise<Response> {

    const { achievementId } =
        await params;

    return router.removeStudentAchievement(
        req,
        achievementId
    );

}