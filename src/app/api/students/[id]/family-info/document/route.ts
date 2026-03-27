//Files: src/app/api/students/[id]/family-info/document/route.ts

import { NextRequest } from "next/server";
import StudentProvider from "@/modules/student/application/provider/StudentProvider";
import { RouteParamHelper } from "@/modules/shared/http/RouteParamHelper";

const router = StudentProvider.childRouter();

/**
 * DELETE /api/students/:id/family-info/document
 */
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {

	const id = await RouteParamHelper.id(params);

	return router.deleteDocument(req, id);
}