//Files :src/app/api/students/route.ts
import type { NextRequest } from "next/server";
import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * Student API Route
 *
 * Route ini merupakan entry point HTTP untuk modul Student
 * pada Next.js App Router.
 *
 * Route hanya bertugas meneruskan request ke controller
 * yang disediakan oleh StudentProvider.
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Endpoint ini digunakan untuk:
 *
 * • mengambil daftar siswa
 * • membuat data siswa baru
 *
 * Semua dependency modul disusun oleh StudentProvider.
 */

const controller = StudentProvider.controller();

/**
 * ============================================================
 * LIST STUDENTS
 * ============================================================
 *
 * @param {NextRequest} request
 * @returns {Promise<Response>}
 *
 * @example
 * GET /api/students?page=1&limit=10
 */

export async function GET(request: NextRequest): Promise<Response> {
  return controller.list(request);
}

/**
 * ============================================================
 * CREATE STUDENT
 * ============================================================
 *
 * @param {NextRequest} request
 * @returns {Promise<Response>}
 *
 * @example
 * POST /api/students
 */

export async function POST(request: NextRequest): Promise<Response> {
  return controller.create(request);
}
