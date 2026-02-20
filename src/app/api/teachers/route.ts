//Files: src/app/api/teachers/route.ts
import { NextRequest } from "next/server";
import {createTeacherController} from "@/app/api/teachers/_factory";

/**
 * ============================================================
 * TEACHER API ROUTE
 * ============================================================
 *
 * Endpoint: /api/teachers
 *
 * Supported Methods:
 * - GET  → List teacher (pagination)
 * - POST → Create new teacher
 *
 * Layer Responsibility:
 * Route → Controller → Service → UseCase → Repository
 *
 * Route layer hanya bertugas:
 * - Meneruskan request ke controller
 * - Tidak mengandung business logic
 */

const controller = createTeacherController();

/**
 * ============================================================
 * GET /api/teachers
 * ------------------------------------------------------------
 * Mengambil daftar guru dengan pagination.
 *
 * Query Params:
 * - page?: number
 * - limit?: number
 * - search?: string
 *
 * Response:
 * 200 → Paginated teacher list
 */
export async function GET(request: NextRequest) {
    return controller.list(request);
}

/**
 * ============================================================
 * POST /api/teachers
 * ------------------------------------------------------------
 * Membuat data guru baru.
 *
 * Body:
 * - CreateTeacherDTO
 *
 * Response:
 * 201 → Created teacher
 * 400 → Validation / Business error
 */
export async function POST(request: NextRequest) {
    return controller.create(request);
}