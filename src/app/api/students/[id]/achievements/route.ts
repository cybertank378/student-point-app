//Files: src/app/api/students/[id]/achievements/route.ts

import { NextRequest } from "next/server";

import StudentProvider
    from "@/modules/student/application/provider/StudentProvider";

import { RouteParamHelper }
    from "@/modules/shared/http/RouteParamHelper";

/**
 * ============================================================
 * STUDENT ACHIEVEMENT ROUTE
 * ============================================================
 *
 * API route responsible for delegating student achievement
 * requests to the StudentChildRouter.
 *
 * Endpoints:
 *
 * GET    /api/students/:id/achievements
 * POST   /api/students/:id/achievements
 */

const router = StudentProvider.childRouter();

/**
 * ============================================================
 * LIST STUDENT ACHIEVEMENTS
 * ============================================================
 *
 * Retrieve all achievement records belonging to a student.
 */

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params);

    return router.listStudentAchievements(
        req,
        studentId
    );

}

/**
 * ============================================================
 * ADD STUDENT ACHIEVEMENT
 * ============================================================
 *
 * Assign a new achievement record to a student.
 */

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {

    const studentId =
        await RouteParamHelper.id(params);

    return router.addStudentAchievement(
        req,
        studentId
    );

}