//Files: src/modules/rombel/infrastructure/repo/RombelRepository.ts
import prisma from "@/libs/prisma";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";
import { RombelMapper } from "@/modules/rombel/domain/mapper/RombelMapper";
import { serverLog } from "@/libs/serverLogger";

export class RombelRepository implements RombelInterface {

    /* =====================================================
       FIND ALL
    ===================================================== */
    async findAll(): Promise<Rombel[]> {

        const context = "RombelRepository.findAll";

        try {

            serverLog(context, "Fetching active rombels");

            const rows = await prisma.class.findMany({
                where: {
                    academicYear: {
                        isActive: true,
                    },
                },
                orderBy: [
                    { grade: "asc" },
                    { name: "asc" },
                ],
                include: {
                    academicYear: {
                        select: { name: true }
                    },
                    _count: {
                        select: {
                            students: {
                                where: { deletedAt: null }
                            }
                        }
                    }
                },
            });

            const result = rows.map((row) =>
                RombelMapper.toDomain(
                    row,
                    row._count.students
                )
            );

            serverLog(context, "Mapped result summary", {
                total: result.length,
            });

            return result;

        } catch (error) {

            serverLog(context, "ERROR", error);
            throw error;
        }
    }

    /* =====================================================
       FIND BY ID
    ===================================================== */
    async findById(id: string): Promise<Rombel | null> {

        const row = await prisma.class.findUnique({
            where: { id },
            include: {
                academicYear: {
                    select: { name: true }
                },
                _count: {
                    select: {
                        students: {
                            where: { deletedAt: null },
                        },
                    },
                },
            },
        });

        if (!row) return null;

        return RombelMapper.toDomain(
            row,
            row._count.students
        );
    }

    /* =====================================================
       CREATE
    ===================================================== */
    async create(dto: CreateRombelDTO): Promise<Rombel> {

        const row = await prisma.class.create({
            data: {
                grade: dto.grade,
                name: dto.name,
                academicYearId: dto.academicYearId,
            },
            include: {
                academicYear: {
                    select: { name: true }
                }
            },
        });

        return RombelMapper.toDomain(row, 0);
    }

    /* =====================================================
       UPDATE
    ===================================================== */
    async update(dto: UpdateRombelDTO): Promise<Rombel> {

        const row = await prisma.class.update({
            where: { id: dto.id },
            data: {
                grade: dto.grade,
                name: dto.name,
                academicYearId: dto.academicYearId,
            },
            include: {
                academicYear: {
                    select: { name: true }
                }
            },
        });

        const studentCount = await prisma.student.count({
            where: {
                rombelId: row.id,
                deletedAt: null,
            },
        });

        return RombelMapper.toDomain(
            row,
            studentCount
        );
    }

    /* =====================================================
       DELETE
    ===================================================== */
    async delete(id: string): Promise<void> {

        const hasStudents = await this.hasStudents(id);

        if (hasStudents) {
            throw new Error(
                "Rombel tidak dapat dihapus karena masih memiliki siswa"
            );
        }

        await prisma.class.delete({
            where: { id },
        });
    }

    /* =====================================================
       CHECK STUDENTS
    ===================================================== */
    async hasStudents(id: string): Promise<boolean> {

        const count = await prisma.student.count({
            where: {
                rombelId: id,
                deletedAt: null,
            },
        });

        return count > 0;
    }

    /* =====================================================
       FIND BY LABEL
    ===================================================== */
    async findByLabel(label: string): Promise<Rombel | null> {

        const [grade, name] = label.split(" ");

        const row = await prisma.class.findFirst({
            where: { grade, name },
            include: {
                academicYear: {
                    select: { name: true }
                },
                _count: {
                    select: {
                        students: {
                            where: { deletedAt: null },
                        },
                    },
                },
            },
        });

        if (!row) return null;

        return RombelMapper.toDomain(
            row,
            row._count.students
        );
    }
}



