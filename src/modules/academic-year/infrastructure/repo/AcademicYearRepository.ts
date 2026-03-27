//Files: src/modules/academic-year/infrastructure/repo/AcademicYearRepository.ts
//Files: src/modules/academic-year/infrastructure/repo/AcademicYearRepository.ts

import prisma from "@/libs/prisma";

import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";
import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";

import { AcademicYearMapper } from "@/modules/academic-year/domain/mapper/AcademicYearMapper";

/**
 * ============================================================
 * PRISMA REPOSITORY — ACADEMIC YEAR
 * ============================================================
 *
 * Implementation of AcademicYearInterface using Prisma ORM.
 *
 * Responsibilities:
 * - Persist AcademicYear entity
 * - Convert Prisma model → Domain entity
 * - Execute transactional operations safely
 *
 * Notes:
 * - Business rules remain in UseCase layer
 * - Repository focuses only on persistence logic
 */

export class AcademicYearRepository implements AcademicYearInterface {

  /* ============================================================
   * FIND ALL
   * ============================================================ */

  async findAll(): Promise<AcademicYear[]> {
    const rows = await prisma.academicYear.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return AcademicYearMapper.toDomainList(rows);
  }

  /* ============================================================
   * FIND BY ID
   * ============================================================ */

  async findById(id: string): Promise<AcademicYear | null> {
    const row = await prisma.academicYear.findUnique({
      where: { id },
    });

    return row ? AcademicYearMapper.toDomain(row) : null;
  }

  /* ============================================================
   * FIND ACTIVE
   * ============================================================ */

  async findActive(): Promise<AcademicYear | null> {
    const row = await prisma.academicYear.findFirst({
      where: {
        isActive: true,
      },
    });

    return row ? AcademicYearMapper.toDomain(row) : null;
  }

  /* ============================================================
   * CHECK OVERLAPPING DATE RANGE
   * ============================================================ */

  async findOverlapping(
      startDate: Date,
      endDate: Date
  ): Promise<boolean> {

    const existing = await prisma.academicYear.findFirst({
      where: {
        startDate: {
          lte: endDate,
        },
        endDate: {
          gte: startDate,
        },
      },
    });

    return !!existing;
  }

  /* ============================================================
   * CREATE
   * ============================================================ */

  async create(dto: CreateAcademicYearDTO): Promise<AcademicYear> {
    const row = await prisma.academicYear.create({
      data: {
        name: dto.name,
        startDate: dto.startDate,
        endDate: dto.endDate,
        isActive: dto.isActive ?? false,
      },
    });

    return AcademicYearMapper.toDomain(row);
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */

  async update(dto: UpdateAcademicYearDTO): Promise<AcademicYear> {
    const row = await prisma.academicYear.update({
      where: {
        id: dto.id,
      },
      data: {
        name: dto.name,
        startDate: dto.startDate,
        endDate: dto.endDate,
        isActive: dto.isActive,
      },
    });

    return AcademicYearMapper.toDomain(row);
  }

  /* ============================================================
   * DEACTIVATE ALL
   * ============================================================ */

  async deactivateAll(): Promise<void> {
    await prisma.academicYear.updateMany({
      where: {
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  /* ============================================================
   * SET ACTIVE ACADEMIC YEAR
   * ============================================================ */

  async setActive(id: string): Promise<void> {

    await prisma.$transaction(async (tx) => {

      const existing = await tx.academicYear.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error("Academic year tidak ditemukan.");
      }

      if (existing.isActive) {
        return;
      }

      await tx.academicYear.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      await tx.academicYear.update({
        where: { id },
        data: {
          isActive: true,
        },
      });

    });

  }

  /* ============================================================
   * DELETE
   * ============================================================ */

  async delete(id: string): Promise<void> {
    await prisma.academicYear.delete({
      where: { id },
    });
  }
}