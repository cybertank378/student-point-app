//Files: src/modules/academic-year/infrastructure/repo/AcademicYearRepository.ts

import prisma  from "@/libs/prisma";

import type { AcademicYearInterface } from "@/modules/academic-year/domain/interfaces/AcademicYearInterface";
import type { CreateAcademicYearDTO } from "@/modules/academic-year/domain/dto/CreateAcademicYearDTO";
import type { UpdateAcademicYearDTO } from "@/modules/academic-year/domain/dto/UpdateAcademicYearDTO";
import type { AcademicYear } from "@/modules/academic-year/domain/entity/AcademicYear";
import {AcademicYearMapper} from "@/modules/academic-year/domain/mapper/AcademicYearMapper";

/**
 * Prisma Repository – AcademicYear
 */
export class AcademicYearRepository
    implements AcademicYearInterface
{
    async findAll(): Promise<AcademicYear[]> {
        const rows = await prisma.academicYear.findMany({
            orderBy: { createdAt: "desc" },
        });

        return AcademicYearMapper.toDomainList(rows);
    }

    async findById(
        id: string,
    ): Promise<AcademicYear | null> {
        const row = await prisma.academicYear.findUnique({
            where: { id },
        });

        return row
            ? AcademicYearMapper.toDomain(row)
            : null;
    }

    async findActive(): Promise<AcademicYear | null> {
        const row = await prisma.academicYear.findFirst({
            where: { isActive: true },
        });

        return row
            ? AcademicYearMapper.toDomain(row)
            : null;
    }

    async create(dto: CreateAcademicYearDTO): Promise<AcademicYear> {
        const row = await prisma.academicYear.create({
            data: {
                name: dto.name,
                startDate: dto.startDate,
                endDate: dto.endDate,
                isActive: false,
            },
        });

        return AcademicYearMapper.toDomain(row);
    }


    async update(
        dto: UpdateAcademicYearDTO,
    ): Promise<AcademicYear> {
        const row = await prisma.academicYear.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                startDate: dto.startDate,
                endDate: dto.endDate,
                isActive:dto.isActive
            },
        });

        return AcademicYearMapper.toDomain(row);
    }

    /**
     * Nonaktifkan semua academic year
     * (dipakai sebelum set aktif)
     */
    async deactivateAll(): Promise<void> {
        await prisma.academicYear.updateMany({
            where: { isActive: true },
            data: { isActive: false },
        });
    }

    /**
     * Set satu academic year sebagai aktif
     */
    async setActive(id: string): Promise<void> {
        await prisma.$transaction(async (tx) => {
            // pastikan data ada
            const existing = await tx.academicYear.findUnique({
                where: { id },
            });

            if (!existing) {
                throw new Error("Academic year tidak ditemukan.");
            }

            // jika sudah aktif, tidak perlu apa-apa
            if (existing.isActive) {
                return;
            }

            // nonaktifkan yang aktif saja
            await tx.academicYear.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });

            // aktifkan yang dipilih
            await tx.academicYear.update({
                where: { id },
                data: { isActive: true },
            });
        });
    }
    /**
     * Delete academic year
     *
     * ⚠️ Biasanya dibatasi oleh usecase
     */
    async delete(id: string): Promise<void> {
        await prisma.academicYear.delete({
            where: { id },
        });
    }
}
