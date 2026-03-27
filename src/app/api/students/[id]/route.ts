//Files: src/app/api/students/[id]/route.ts

import type { NextRequest } from "next/server";
import { RouteParamHelper } from "@/modules/shared/http/RouteParamHelper";
import StudentProvider from "@/modules/student/application/provider/StudentProvider";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * Student Detail Route
 *
 * Route handler untuk operasi terhadap resource
 * Student berdasarkan ID.
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * Endpoint ini digunakan untuk:
 *
 * • mengambil detail siswa
 * • memperbarui data siswa
 * • menghapus siswa
 *
 * Dependency controller disediakan oleh
 * StudentProvider sebagai composition root.
 */

const controller = StudentProvider.controller();

/**
 * ============================================================
 * GET STUDENT BY ID
 * ============================================================
 *
 * Mengambil detail siswa berdasarkan ID.
 *
 * ------------------------------------------------------------
 * PARAM
 * ------------------------------------------------------------
 *
 * @param {NextRequest} request
 * @param {Promise<{ id: string }>} params
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
 * GET /api/students/uuid-student
 */

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const id = await RouteParamHelper.id(params);

  return controller.getById(id);
}

/**
 * ============================================================
 * UPDATE STUDENT
 * ============================================================
 *
 * Memperbarui data siswa secara parsial.
 *
 * ------------------------------------------------------------
 * PARAM
 * ------------------------------------------------------------
 *
 * @param {NextRequest} request
 * @param {Promise<{ id: string }>} params
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
 * PATCH /api/students/uuid-student
 */

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const id = await RouteParamHelper.id(params);

  return controller.update(id, request);
}

/**
 * ============================================================
 * DELETE STUDENT
 * ============================================================
 *
 * Menghapus data siswa dari sistem.
 *
 * ------------------------------------------------------------
 * PARAM
 * ------------------------------------------------------------
 *
 * @param {NextRequest} request
 * @param {Promise<{ id: string }>} params
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
 * DELETE /api/students/uuid-student
 */

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const id = await RouteParamHelper.id(params);

  return controller.delete(id);
}
