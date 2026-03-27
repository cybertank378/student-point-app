// Files: src/app/api/students/nis/[nis]/route.ts

import type { NextRequest } from "next/server";
import { RouteParamHelper } from "@/modules/shared/http/RouteParamHelper";
import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * Student By NIS Route
 *
 * Route handler untuk mengambil data siswa
 * berdasarkan **NIS (Nomor Induk Siswa)**.
 *
 * Dependency controller disediakan oleh
 * StudentProvider sebagai composition root.
 */

const controller = StudentProvider.controller();

/**
 * ============================================================
 * GET STUDENT BY NIS
 * ============================================================
 *
 * Mengambil profil siswa berdasarkan NIS.
 *
 * ------------------------------------------------------------
 * PARAM
 * ------------------------------------------------------------
 *
 * @param {NextRequest} request
 * @param {Promise<{ nis: string }>} params
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
 * GET /api/students/nis/202300145
 */

export async function GET(request: NextRequest, { params }: { params: Promise<{ nis: string }> }) {
  const nis = await RouteParamHelper.param(params, "nis");

  return controller.getByNis(nis);
}
