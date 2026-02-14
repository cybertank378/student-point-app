//Files: src/modules/student/infrastructure/http/StudentController.ts

import type { NextRequest } from "next/server";
import {
  AssignAcademicYearSchema,
  AssignRombelSchema,
  BatchAssignAcademicYearSchema,
  BatchAssignRombelSchema,
  CreateStudentSchema,
  StudentQuerySchema,
  UpdateStudentSchema,
} from "@/modules/student/infrastructure/validators/student.validator";
import { handleZodError } from "@/modules/shared/errors/handleZodError";
import type { StudentService } from "@/modules/student/application/services/StudentService";

/**
 * StudentController
 * -----------------
 * HTTP Adapter for Student module
 *
 * NOTE:
 * - RbacConfig ada di API route (withRBAC)
 * - Controller hanya handle:
 *   - parsing
 *   - validation
 *   - mapping HTTP <-> service
 */
export class StudentController {
  constructor(private readonly service: StudentService) {}

  /**
   * ======================================
   * ============ LIST (GET ALL) ==========
   * ======================================
   * GET /api/students
   *
   * Query:
   * - rombelId
   * - status
   * - page
   * - limit
   */
  async getAll(req: NextRequest) {
    try {
      const parsed = StudentQuerySchema.parse(
        Object.fromEntries(req.nextUrl.searchParams),
      );

      const { page, limit, ...query } = parsed;

      const result = await this.service.getAll(query);

      if (result.isFailure) {
        return Response.json({ error: result.getError() }, { status: 400 });
      }

      const rows = result.getValue();
      const total = rows.length;

      const start = (page - 1) * limit;
      const end = start + limit;

      return Response.json({
        rows: rows.slice(start, end),
        total,
      });
    } catch (error) {
      return handleZodError(error);
    }
  }

  /**
   * ======================================
   * ============ GET BY ID ===============
   * ======================================
   * GET /api/students/:id
   */
  async getById(id: string) {
    const result = await this.service.getById(id);

    if (result.isFailure) {
      return Response.json({ error: result.getError() }, { status: 404 });
    }

    return Response.json(result.getValue());
  }

  /**
   * ======================================
   * ============ GET BY NIS ==============
   * ======================================
   * GET /api/students/nis/:nis
   */
  async getByNis(nis: number) {
    const result = await this.service.getByNis(nis);

    if (result.isFailure) {
      return Response.json({ error: result.getError() }, { status: 404 });
    }

    return Response.json(result.getValue());
  }

  /**
   * ======================================
   * ============== CREATE ===============
   * ======================================
   * POST /api/students
   */
  async create(req: NextRequest) {
    try {
      const body = CreateStudentSchema.parse(await req.json());

      const result = await this.service.create(body);

      if (result.isFailure) {
        return Response.json({ error: result.getError() }, { status: 400 });
      }

      return Response.json(result.getValue(), { status: 201 });
    } catch (error) {
      return handleZodError(error);
    }
  }

  /**
   * ======================================
   * ============== UPDATE ===============
   * ======================================
   * PUT /api/students/:id
   */
  async update(id: string, req: NextRequest) {
    try {
      const body = UpdateStudentSchema.parse(await req.json());

      const result = await this.service.update({
        id,
        ...body,
      });

      if (result.isFailure) {
        return Response.json({ error: result.getError() }, { status: 400 });
      }

      return Response.json(result.getValue());
    } catch (error) {
      return handleZodError(error);
    }
  }

  /**
   * ======================================
   * ============== DELETE ===============
   * ======================================
   * DELETE /api/students/:id
   *
   * Soft delete
   */
  async delete(id: string) {
    const result = await this.service.delete(id);

    if (result.isFailure) {
      return Response.json({ error: result.getError() }, { status: 400 });
    }

    return Response.json({ success: true });
  }

  /**
   * ======================================
   * ========= ASSIGN STUDENT → ROMBEL =====
   * ======================================
   * POST /api/students/assign-rombel
   */
  async assignRombel(req: NextRequest) {
    try {
      const body = AssignRombelSchema.parse(await req.json());

      const result = await this.service.assignToRombel(
        body.studentId,
        body.rombelId,
      );

      if (result.isFailure) {
        return Response.json({ error: result.getError() }, { status: 400 });
      }

      return Response.json({ success: true });
    } catch (error) {
      return handleZodError(error);
    }
  }

  /**
   * ======================================
   * ======= BATCH ASSIGN → ROMBEL =========
   * ======================================
   * POST /api/students/batch-assign-rombel
   */
  async batchAssignRombel(req: NextRequest) {
    try {
      const body = BatchAssignRombelSchema.parse(await req.json());

      const result = await this.service.batchAssignToRombel(
        body.studentIds,
        body.rombelId,
      );

      if (result.isFailure) {
        return Response.json({ error: result.getError() }, { status: 400 });
      }

      return Response.json({
        success: true,
        assigned: result.getValue(),
      });
    } catch (error) {
      return handleZodError(error);
    }
  }

  /**
   * ======================================
   * ===== ASSIGN STUDENT → ACADEMIC YEAR ==
   * ======================================
   * POST /api/students/assign-academic-year
   */
  async assignAcademicYear(req: NextRequest) {
    try {
      const body = AssignAcademicYearSchema.parse(await req.json());

      const updated = await this.service.assignAcademicYear(
        body.studentId,
        body.rombelId,
      );

      return Response.json(updated);
    } catch (error) {
      return handleZodError(error);
    }
  }

  /**
   * ======================================
   * === BATCH ASSIGN → ACADEMIC YEAR ======
   * ======================================
   * POST /api/students/batch-assign-academic-year
   */
  async batchAssignAcademicYear(req: NextRequest) {
    try {
      const body = BatchAssignAcademicYearSchema.parse(await req.json());

      const assigned = await this.service.batchAssignAcademicYear(
        body.studentIds,
        body.rombelId,
      );

      return Response.json({
        success: true,
        assigned,
      });
    } catch (error) {
      return handleZodError(error);
    }
  }
}
