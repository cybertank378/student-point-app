// Files: src/app/api/students/check-nisn/[nisn]/route.ts

import { RouteParamHelper } from "@/modules/shared/http/RouteParamHelper";
import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * Student NISN Validation Route
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Endpoint ini digunakan untuk memeriksa apakah
 * NISN sudah terdaftar pada sistem.
 */

const controller = StudentProvider.controller();

/**
 * ============================================================
 * CHECK NISN
 * ============================================================
 *
 * ------------------------------------------------------------
 * PARAM
 * ------------------------------------------------------------
 *
 * @param request
 * @param {Promise<{ nisn: string }>} params
 *
 * ------------------------------------------------------------
 * RETURNS
 * ------------------------------------------------------------
 *
 * @returns {Promise<Response>}
 *
 * ------------------------------------------------------------
 * EXAMPLE
 * ------------------------------------------------------------
 *
 * GET /api/students/check-nisn/1234567890
 */

export async function GET(request: Request, { params }: { params: Promise<{ nisn: string }> }): Promise<Response> {
  const nisn = await RouteParamHelper.param(params, "nisn");

  return controller.checkNisn(nisn);
}
