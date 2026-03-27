// Files: src/app/api/students/[id]/family-info/upload/route.ts

import { NextRequest } from "next/server";
import StudentProvider from "@/modules/student/application/provider/StudentProvider";
import { RouteParamHelper } from "@/modules/shared/http/RouteParamHelper";

const router = StudentProvider.childRouter();

/**
 * ============================================================
 * POST /api/students/:id/family-info/upload
 * ============================================================
 */
export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {

	const id = await RouteParamHelper.id(params);

	return router.uploadDocument(req, id);
}