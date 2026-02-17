//Files: src/app/api/users/search/route.ts


/**
 * ============================================================
 * USER SEARCH API ROUTE
 * ============================================================
 *
 * Endpoint:
 *   GET /api/users/search
 *
 * Digunakan untuk:
 *   - Pencarian user (B-Tree optimized)
 *   - Filtering berdasarkan role, status, teacherRole
 *   - Filtering berdasarkan range tanggal
 *   - Sorting dynamic (createdAt / username)
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

import { userController } from "@/app/api/users/_factory";
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
 * - username: string
 * - role: ADMIN | TEACHER | STUDENT | PARENT
 * - isActive: true | false
 * - teacherRole: SUBJECT_TEACHER | HOMEROOM | COUNSELOR | DUTY_TEACHER
 * - createdFrom: ISO Date
 * - createdTo: ISO Date
 * - sortBy: createdAt | username
 * - sortOrder: asc | desc
 *
 * Example:
 * GET /api/users/search?page=1&limit=10&username=az&role=STUDENT&isActive=true
 */
export async function GET(request: NextRequest) {
    return userController.search(request);
}
