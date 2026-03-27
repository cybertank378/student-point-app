//Files: src/app/api/students/[id]/family-info/route.ts
import { NextRequest } from "next/server"

import StudentProvider from "@/modules/student/application/provider/StudentProvider"

import { RouteParamHelper } from "@/modules/shared/http/RouteParamHelper"


const router = StudentProvider.childRouter()


/**
 * ============================================================
 * GET /api/students/:id/family-info
 * ============================================================
 */

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {

	const id = await RouteParamHelper.id(params)

	return router.getFamilyInfo(req, id)

}


/**
 * ============================================================
 * POST /api/students/:id/family-info
 * ============================================================
 */

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {

	const id = await RouteParamHelper.id(params)

	return router.createFamilyInfo(req, id)

}


/**
 * ============================================================
 * PATCH /api/students/:id/family-info
 * ============================================================
 */

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {

	const id = await RouteParamHelper.id(params)

	return router.updateFamilyInfo(req, id)

}


/**
 * ============================================================
 * DELETE /api/students/:id/family-info
 * ============================================================
 */

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {

	const id = await RouteParamHelper.id(params)

	return router.deleteFamilyInfo(req, id)

}