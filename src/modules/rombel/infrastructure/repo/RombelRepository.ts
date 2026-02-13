//Files: src/modules/rombel/infrastructure/repo/RombelRepository.ts

import  prisma  from "@/libs/prisma";

import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";
import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";
import {RombelMapper} from "@/modules/rombel/domain/mapper/RombelMapper";

export class RombelRepository implements RombelInterface {

    async findAll(): Promise<Rombel[]> {
        const rows = await prisma.class.findMany({
            orderBy: [
                { grade: "asc" },
                { name: "asc" },
            ],
            include: {
                _count: {
                    select: {
                        students: {
                            where: { deletedAt: null },
                        },
                    },
                },
            },
        });

        return rows.map((row) =>
            RombelMapper.toDomain(row, row._count.students),
        );
    }

    async findById(id: string): Promise<Rombel | null> {
        const row = await prisma.class.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        students: {
                            where: { deletedAt: null },
                        },
                    },
                },
            },
        });

        return row
            ? RombelMapper.toDomain(row, row._count.students)
            : null;
    }

    async create(dto: CreateRombelDTO): Promise<Rombel> {
        const row = await prisma.class.create({
            data: {
                grade: dto.grade,
                name: dto.name,
                academicYearId: dto.academicYearId,
            },
        });

        return RombelMapper.toDomain(row, 0);
    }

    async update(dto: UpdateRombelDTO): Promise<Rombel> {
        const row = await prisma.class.update({
            where: { id: dto.id },
            data: {
                grade: dto.grade,
                name: dto.name,
                academicYearId: dto.academicYearId,
            },
        });

        const studentCount = await prisma.student.count({
            where: {
                rombelId: row.id, // ✅ FIX
                deletedAt: null,
            },
        });

        return RombelMapper.toDomain(row, studentCount);
    }

    async delete(id: string): Promise<void> {
        const hasStudents = await this.hasStudents(id);
        if (hasStudents) {
            throw new Error("Rombel tidak dapat dihapus karena masih memiliki siswa");
        }

        await prisma.class.delete({
            where: { id },
        });
    }

    async hasStudents(id: string): Promise<boolean> {
        const count = await prisma.student.count({
            where: {
                rombelId: id, // ✅ FIX
                deletedAt: null,
            },
        });

        return count > 0;
    }

    async findByLabel(label: string): Promise<Rombel | null> {
        const [grade, name] = label.split(" ");

        const row = await prisma.class.findFirst({
            where: { grade, name },
            include: {
                _count: {
                    select: {
                        students: {
                            where: { deletedAt: null },
                        },
                    },
                },
            },
        });

        return row
            ? RombelMapper.toDomain(row, row._count.students)
            : null;
    }
}

