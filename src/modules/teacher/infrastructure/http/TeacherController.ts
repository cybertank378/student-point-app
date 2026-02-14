//Files: src/modules/teacher/infrastructure/http/http/TeacherController.ts

import type { NextRequest } from "next/server";
import type { TeacherService } from "@/modules/teacher/application/services/TeacherService";
import {
  AssignHomeroomSchema,
  AssignTeacherRoleSchema,
  CreateTeacherSchema,
  UpdateTeacherSchema,
} from "@/modules/teacher/infrastructure/validators/teacher.validator";
import { handleZodError } from "@/modules/shared/errors/handleZodError";

export class TeacherController {
  constructor(private readonly service: TeacherService) {}

  async getAll() {
    const result = await this.service.getAll();
    return result.isSuccess
      ? Response.json(result.getValue())
      : Response.json({ error: result.getError() }, { status: 400 });
  }

  async getById(id: string) {
    const result = await this.service.getById(id);
    return result.isSuccess
      ? Response.json(result.getValue())
      : Response.json({ error: result.getError() }, { status: 404 });
  }

  async create(req: NextRequest) {
    try {
      const body = CreateTeacherSchema.parse(await req.json());
      const result = await this.service.create(body);
      return Response.json(result.getValue(), { status: 201 });
    } catch (e) {
      return handleZodError(e);
    }
  }

  async update(id: string, req: NextRequest) {
    try {
      const body = UpdateTeacherSchema.parse(await req.json());
      const result = await this.service.update({ id, ...body });
      return Response.json(result.getValue());
    } catch (e) {
      return handleZodError(e);
    }
  }

  async delete(id: string) {
    const result = await this.service.delete(id);
    return result.isSuccess
      ? Response.json({ success: true })
      : Response.json({ error: result.getError() }, { status: 400 });
  }

  async assignRole(id: string, req: NextRequest) {
    try {
      const body = AssignTeacherRoleSchema.parse(await req.json());
      const result = await this.service.assignRole({
        teacherId: id,
        roles: body.roles,
      });
      return Response.json(result.getValue());
    } catch (e) {
      return handleZodError(e);
    }
  }

  async assignHomeroom(id: string, req: NextRequest) {
    try {
      const body = AssignHomeroomSchema.parse(await req.json());
      const _result = await this.service.assignHomeroom(id, body.classId);
      return Response.json({ success: true });
    } catch (e) {
      return handleZodError(e);
    }
  }
}
