//Files: src/modules/rombel/infrastructure/repo/RombelRepository.ts

import prisma from "@/libs/prisma";

import type { RombelInterface } from "@/modules/rombel/domain/interfaces/RombelInterface";
import type { CreateRombelDTO } from "@/modules/rombel/domain/dto/CreateRombelDTO";
import type { UpdateRombelDTO } from "@/modules/rombel/domain/dto/UpdateRombelDTO";
import type { Rombel } from "@/modules/rombel/domain/entity/Rombel";

import { RombelMapper } from "@/modules/rombel/domain/mapper/RombelMapper";

export class RombelRepository implements RombelInterface {

    async findAll(): Promise<Rombel[]> {

        const rows = await prisma.class.findMany({

            orderBy: [
                { grade: "asc" },
                { name: "asc" }
            ],

            include: {
                academicYear: true,
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            }

        });

        return RombelMapper.toDomainList(rows);

    }
    async findById(id: string): Promise<Rombel | null> {

        const row = await prisma.class.findUnique({

            where: { id },

            include: {
                academicYear: true,
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            }

        });

        return row ? RombelMapper.toDomain(row) : null;

    }

    async findByAcademicYear(academicYearId: string): Promise<Rombel[]> {

        const rows = await prisma.class.findMany({

            where: { academicYearId },

            include: {
                academicYear: true,
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            },
            orderBy: [
                { grade: "asc" },
                { name: "asc" }
            ]

        });

        return RombelMapper.toDomainList(rows);

    }

    async create(dto: CreateRombelDTO): Promise<Rombel> {

        const row = await prisma.class.create({

            data: {
                grade: dto.grade,
                name: dto.name,
                academicYearId: dto.academicYearId,
                homeroomTeacherId: dto.homeroomTeacherId ?? null
            },

            include: {
                academicYear: true,
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            }

        });

        return RombelMapper.toDomain(row);

    }

    async update(dto: UpdateRombelDTO): Promise<Rombel> {

        const row = await prisma.class.update({

            where: { id: dto.id },

            data: {
                grade: dto.grade,
                name: dto.name,
                academicYearId: dto.academicYearId,
                homeroomTeacherId: dto.homeroomTeacherId ?? null
            },

            include: {
                academicYear: true,
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            }

        });

        return RombelMapper.toDomain(row);

    }

    async delete(id: string): Promise<void> {

        await prisma.class.delete({
            where: { id }
        });

    }

}