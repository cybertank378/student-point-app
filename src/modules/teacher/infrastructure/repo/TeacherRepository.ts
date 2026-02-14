//Files: src/modules/teacher/infrastructure/repo/TeacherRepository.ts
import prisma from "@/libs/prisma";

import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";

import { TeacherMapper } from "@/modules/teacher/domain/mapper/TeacherMapper";
import type { TeacherRole } from "@/generated/prisma";

export class TeacherRepository implements TeacherInterface {
  async findAll() {
    const rows = await prisma.teacher.findMany({
      include: {
        homeroomOf: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return TeacherMapper.toDomainList(rows);
  }

  async findById(id: string) {
    const row = await prisma.teacher.findUnique({
      where: { id },
      include: {
        homeroomOf: true,
      },
    });

    return row ? TeacherMapper.toDomain(row) : null;
  }

  async findByUserId(userId: string) {
    const row = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        homeroomOf: true,
      },
    });

    return row ? TeacherMapper.toDomain(row) : null;
  }

  async create(dto: CreateTeacherDTO) {
    const row = await prisma.teacher.create({
      data: {
        userId: dto.userId,
        nip: dto.nip,
        name: dto.name,
        phone: dto.phone ?? null,
        email: dto.email ?? null,
        roles: dto.roles,
      },
      include: {
        homeroomOf: true,
      },
    });

    return TeacherMapper.toDomain(row);
  }

  async update(dto: UpdateTeacherDTO) {
    const row = await prisma.teacher.update({
      where: { id: dto.id },
      data: {
        nip: dto.nip,
        name: dto.name,
        phone: dto.phone ?? null,
        email: dto.email ?? null,
        roles: dto.roles,
      },
      include: {
        homeroomOf: true,
      },
    });

    return TeacherMapper.toDomain(row);
  }

  /**
   * Update teacher roles only
   */
  async updateRoles(id: string, roles: TeacherRole[]) {
    const row = await prisma.teacher.update({
      where: { id },
      data: {
        roles,
      },
      include: {
        homeroomOf: true,
      },
    });

    return TeacherMapper.toDomain(row);
  }

  /**
   * Assign teacher as homeroom teacher
   * (1 rombel = 1 wali kelas)
   */
  async assignHomeroom(teacherId: string, classId: string): Promise<void> {
    await prisma.class.update({
      where: { id: classId },
      data: {
        homeroomTeacherId: teacherId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.teacher.delete({
      where: { id },
    });
  }
}
