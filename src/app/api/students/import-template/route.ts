// Files: src/app/api/students/import-template/route.ts

import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * Student Import Template Route
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Endpoint untuk mengunduh template Excel
 * yang digunakan untuk proses import siswa.
 */

const controller = StudentProvider.controller();

/**
 * ============================================================
 * DOWNLOAD TEMPLATE
 * ============================================================
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
 * GET /api/students/import-template
 */

export async function GET(): Promise<Response> {
  return controller.importTemplate();
}
