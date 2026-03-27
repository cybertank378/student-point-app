//Files: src/app/api/students/[id]/composite/route.ts

import type { NextRequest } from "next/server";

import { StudentCompositeController } from "@/modules/student-composite/infrastructure/http/StudentCompositeController";

const controller = new StudentCompositeController();

/**
 * GET /api/students/:id/composite
 */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;

  return controller.getComposite(req, id);
}
