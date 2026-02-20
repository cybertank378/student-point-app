//Files: src/app/api/teachers/export/route.ts

import {createTeacherController} from "@/app/api/teachers/_factory";

/**
 * ============================================================
 * TEACHER EXPORT ROUTE
 * ============================================================
 *
 * Endpoint:
 * - GET /api/teachers/export
 *
 * Digunakan untuk mengambil seluruh data guru
 * untuk kebutuhan export (JSON/XLSX).
 */

const controller = createTeacherController();

/**
 * GET /api/teachers/export
 */
export async function GET() {
    return controller.export();
}
