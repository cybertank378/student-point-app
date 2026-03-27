// Files: src/modules/student/infrastructure/http/StudentController.ts

import { type NextRequest, NextResponse } from "next/server";
import type { ExcelAdapter } from "@/modules/shared/core/ExcelAdapter";
import { Result } from "@/modules/shared/core/Result";
import { toApiError } from "@/modules/shared/errors/ApiError";
import { AppError } from "@/modules/shared/errors/AppError";
import { handleZodError } from "@/modules/shared/errors/handleZodError";
import { HttpResultHandler } from "@/modules/shared/http/HttpResultHandler";
import type { StudentService } from "@/modules/student/application/services/StudentService";
import type { UploadStudentImageRequest } from "@/modules/student/application/usecases/UploadStudentImageUseCase";
import { StudentExcelMapper } from "@/modules/student/domain/mapper/StudentExcelMapper";
import { StudentImportTemplateBuilder } from "@/modules/student/infrastructure/http/StudentImportTemplateBuilder";
import {
  createStudentSchema,
  deleteStudentSchema,
  importStudentSchema,
  ListStudentSchema,
  studentNisnSchema,
  updateStudentSchema,
} from "@/modules/student/infrastructure/validators/student.validator";
/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * StudentController
 *
 * @module student
 * @layer infrastructure/http
 *
 * ============================================================
 * DESKRIPSI DOMAIN
 * ============================================================
 *
 * HTTP Adapter yang bertanggung jawab menangani
 * request API untuk modul Student.
 *
 * Controller berfungsi untuk:
 *
 * - parsing HTTP request
 * - validasi schema menggunakan Zod
 * - memanggil StudentService
 * - mentransform response menggunakan Presenter
 *
 * Controller tidak mengandung business logic.
 * Seluruh aturan bisnis berada pada UseCase.
 */

export class StudentController {
  constructor(
    private readonly service: StudentService,
    private readonly excel: ExcelAdapter
  ) {}

  /* ==========================================================
     LIST
     ========================================================== */

  async list(request: NextRequest): Promise<Response> {
    try {
      const { searchParams } = new URL(request.url);

      const parsed = ListStudentSchema.parse({
        page: searchParams.get("page"),
        limit: searchParams.get("limit"),

        search: searchParams.get("search") ?? undefined,

        classId: searchParams.get("classId") ?? undefined,

        isDifable: searchParams.get("isDifable") ?? undefined,

        status: searchParams.get("status") ?? undefined,
      });

      const result = await this.service.getList(parsed);

      if (!result.isSuccess) {
        return HttpResultHandler.handle(result);
      }

      const value = result.getValue();

      const transformed = {
        data: value.data,
        total: value.total,
        page: value.page,
        limit: value.limit,
        totalPages: Math.ceil(value.total / value.limit),
      };

      return HttpResultHandler.handle(Result.ok(transformed));
    } catch (error) {
      return handleZodError(error);
    }
  }
  /* ==========================================================
     GET BY ID
     ========================================================== */

  async getById(id: string): Promise<Response> {
    const result = await this.service.getById(id);

    if (!result.isSuccess) {
      return HttpResultHandler.handle(result);
    }

    const transformed = result.getValue();

    return HttpResultHandler.handle(Result.ok(transformed));
  }

  /* ==========================================================
   GET BY NIS
   ========================================================== */

  async getByNis(nis: string): Promise<Response> {
    const result = await this.service.getByNis(nis);

    if (!result.isSuccess) {
      return HttpResultHandler.handle(result);
    }

    const transformed = result.getValue();

    return HttpResultHandler.handle(Result.ok(transformed));
  }

  /* ==========================================================
     CREATE
     ========================================================== */

  async create(req: NextRequest): Promise<Response> {
    try {
      const body = createStudentSchema.parse(await req.json());

      const result = await this.service.create(body);

      if (!result.isSuccess) {
        return HttpResultHandler.handle(result, 400);
      }

      const transformed = result.getValue();

      return HttpResultHandler.handle(Result.ok(transformed), 201);
    } catch (error) {
      return handleZodError(error);
    }
  }

  /* ==========================================================
     UPDATE
     ========================================================== */

  async update(id: string, req: NextRequest): Promise<Response> {
    try {
      const body = updateStudentSchema.parse(await req.json());

      const result = await this.service.update({
        id,
        ...body,
        nisn: body.nisn ?? undefined
      });

      if (!result.isSuccess) {
        return HttpResultHandler.handle(result);
      }

      const transformed = result.getValue();

      return HttpResultHandler.handle(Result.ok(transformed));
    } catch (error) {
      return handleZodError(error);
    }
  }

  /* ==========================================================
     DELETE
     ========================================================== */

  async delete(id: string): Promise<Response> {
    const payload = deleteStudentSchema.parse({
      id,
    });

    const result = await this.service.delete(payload);

    return HttpResultHandler.handle(result);
  }

  /* ==========================================================
     CHECK NISN
     ========================================================== */

  async checkNisn(nisn: string): Promise<Response> {
    const payload = studentNisnSchema.parse(nisn);

    const result = await this.service.checkNisnExists(payload);

    return HttpResultHandler.handle(result);
  }

  /* ==========================================================
     IMPORT
     ========================================================== */

  async import(req: NextRequest): Promise<Response> {
    try {
      const formDatas = await req.formData();
      const file = formDatas.get("file") as File | null;

      if (!file) {
        return HttpResultHandler.handle(Result.fail(new AppError("File tidak ditemukan.", 400, "FILE_NOT_FOUND")));
      }

      const buffer = new Uint8Array(await file.arrayBuffer());

      const rawRows = await this.excel.parse(buffer, {
        headerRow: 1,
        mapRow: (row) => row,
      });

      /* =====================================================
         MAP EXCEL ROW -> DTO
         ===================================================== */

      const mapped = rawRows.map((row) => StudentExcelMapper.toDTO(row));

      /* =====================================================
         VALIDATE DTO ARRAY
         ===================================================== */

      const validated = importStudentSchema.parse(mapped);

      /* =====================================================
         SERVICE
         ===================================================== */

      const result = await this.service.import(validated);

      return HttpResultHandler.handle(result);
    } catch (error) {
      return handleZodError(error);
    }
  }
  /* ==========================================================
     IMPORT-TEMPLATE
     ========================================================== */

  async importTemplate(): Promise<Response> {
    try {
      const buffer = await StudentImportTemplateBuilder.build();

      // 🔥 Convert Buffer → Uint8Array
      const uint8 = new Uint8Array(buffer);

      return new NextResponse(uint8, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": "attachment; filename=student-import-template.xlsx",
          "Cache-Control": "no-store",
        },
      });
    } catch (err) {
      const apiError = toApiError(err, "Gagal membuat template import guru.");

      return NextResponse.json(apiError, {
        status: apiError.statusCode,
      });
    }
  }
  /* ==========================================================
   UPLOAD IMAGE
   ========================================================== */
  async upload(req: Request, studentId: string) {
    /* =========================================================
     1️⃣ Parse multipart form data
     ========================================================= */

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    /* =========================================================
     2️⃣ HTTP-Level Validation (Transport Only)
     ========================================================= */

    if (!file) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "File tidak ditemukan.",
        }),
        { status: 400 }
      );
    }

    /* =========================================================
     3️⃣ Delegate to Application Layer
     ========================================================= */

    const request: UploadStudentImageRequest = {
      studentId,
      file,
    };

    const result = await this.service.uploadStudentImage(request);

    /* =========================================================
     4️⃣ Standardized HTTP Response
     ========================================================= */

    return HttpResultHandler.handle(result);
  }

  /* ==========================================================
   STUDENT STATISTICS
   ========================================================== */

  async statistics(): Promise<Response> {
    const result = await this.service.getStatistics();

    if (!result.isSuccess) {
      return HttpResultHandler.handle(result);
    }

    const value = result.getValue();

    const transformed = {
      totalStudents: value.totalStudents,
      totalGrade7: value.totalGrade7,
      totalGrade8: value.totalGrade8,
      totalGrade9: value.totalGrade9,
      monthlyViolationByGrade: value.monthlyViolationByGrade,
      violationTrend: value.violationTrend,
    };

    return HttpResultHandler.handle(Result.ok(transformed));
  }
}
