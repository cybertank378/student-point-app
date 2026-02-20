//Files: src/app/api/teachers/search/route.ts


/**
 * ============================================================
 * TEACHER SEARCH API ROUTE
 * ============================================================
 *
 * Endpoint:
 *   GET /api/teachers/search
 *
 * Digunakan untuk:
 *   - Pencarian teacher (B-Tree optimized)
 *   - Filtering berdasarkan role, status, teacherRole
 *   - Filtering berdasarkan range tanggal
 *   - Sorting dynamic (createdAt / teachername)
 *   - Pagination
 *
 * Flow:
 *   Route → Controller → Service → UseCase → Repository → Prisma → PostgreSQL
 *
 * Catatan:
 *   - Menggunakan composite index (isActive, createdAt)
 *   - Menggunakan B-Tree friendly search (startsWith / equality)
 *   - Menggunakan Result pattern untuk error handling
 */

import { createTeacherController } from "@/app/api/teachers/_factory";
import { NextRequest } from "next/server";

/**
 * ============================================================
 * HANDLE GET REQUEST
 * ============================================================
 *
 * Query Params yang didukung:
 *
 * - page: number
 * - limit: number
 * - teachername: string
 * - role: ADMIN | TEACHER | STUDENT | PARENT
 * - isActive: true | false
 * - teacherRole: SUBJECT_TEACHER | HOMEROOM | COUNSELOR | DUTY_TEACHER
 * - createdFrom: ISO Date
 * - createdTo: ISO Date
 * - sortBy: createdAt | teachername
 * - sortOrder: asc | desc
 *
 * Example:
 * GET /api/teachers/search?page=1&limit=10&teachername=az&role=STUDENT&isActive=true
 */
export async function GET(request: NextRequest) {
    const controller = createTeacherController();
    return controller.search(request);
}
