//Files: src/app/api/students/[id]/photo/route.ts

import type { NextRequest } from "next/server";
import { RouteParamHelper } from "@/modules/shared/http/RouteParamHelper";
import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * UPLOAD STUDENT PHOTO
 * ============================================================
 */

const controller = StudentProvider.controller();

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = await RouteParamHelper.id(params);

  return controller.upload(req, id);
}
