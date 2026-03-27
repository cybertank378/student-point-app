//Files: src/app/api/students/import/route.ts
import type { NextRequest } from "next/server";
import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * Student Import Route
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Endpoint untuk import data siswa dari file Excel.
 *
 * File akan diproses oleh:
 *
 * ExcelAdapter
 *        ↓
 * StudentExcelMapper
 *        ↓
 * StudentService.import
 */

const controller = StudentProvider.controller();

/**
 * ============================================================
 * IMPORT STUDENTS
 * ============================================================
 *
 * ------------------------------------------------------------
 * PARAM
 * ------------------------------------------------------------
 *
 * @param {NextRequest} request
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
 * POST /api/students/import
 */

export async function POST(request: NextRequest): Promise<Response> {
  return controller.import(request);
}
