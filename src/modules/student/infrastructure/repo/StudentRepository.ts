//Files: src/modules/student/infrastructure/repo/StudentRepository.ts

import prisma from "@/libs/prisma";

import {StudentStatusMapper} from "@/modules/student/domain/mapper/StudentStatusMapper";
import {StudentMapper} from "@/modules/student/domain/mapper/StudentMapper";
import {GenderMapper} from "@/modules/student/domain/mapper/GenderMapper";
import type {UpdateStudentDTO} from "@/modules/student/domain/dto/UpdateStudentDTO";
import type {StudentInterface} from "@/modules/student/domain/interfaces/StudentInterface";
import type {StudentQueryDTO} from "@/modules/student/domain/dto/StudentQueryDTO";
import type {CreateStudentDTO} from "@/modules/student/domain/dto/CreateStudentDTO";
import type {Student} from "@/modules/student/domain/entity/Student";
import {FamilyStatusMapper} from "@/modules/student/domain/mapper/FamilyStatusMapper";

export class StudentRepository implements StudentInterface {
    async findAll(query?: StudentQueryDTO) {
        const rows = await prisma.student.findMany({
            where: {
                deletedAt: null,
                ...(query?.rombelId && {rombelId: query.rombelId}),
                ...(query?.status && {
                    status: StudentStatusMapper.toPrisma(query.status),
                }),
            },
        });

        return rows.map(StudentMapper.toDomain);
    }

    async findById(id: string) {
        const row = await prisma.student.findFirst({
            where: {id, deletedAt: null},
        });

        return row ? StudentMapper.toDomain(row) : null;
    }

    async findByNis(nis: string) {
        const row = await prisma.student.findUnique({where: {nis}});
        return row ? StudentMapper.toDomain(row) : null;
    }

    async create(dto: CreateStudentDTO): Promise<Student> {
        const row = await prisma.student.create({
            data: {
                nis: dto.nis ?? null,
                nisn: dto.nisn,
                name: dto.name,
                nickname: dto.nickname ?? null,
                gender: GenderMapper.toPrisma(dto.gender),
                religionCode: dto.religionCode,
                rombelId: dto.rombelId,
                isDifable: dto.isDifable ?? false,
                difableNotes: dto.difableNotes ?? null,

                ...(dto.status !== undefined && {
                    status: StudentStatusMapper.toPrisma(dto.status),
                }),

                ...(dto.familyStatus !== undefined && {
                    familyStatus:
                        FamilyStatusMapper.toPrisma(dto.familyStatus),
                }),
            },
        });

        return StudentMapper.toDomain(row);
    }

    async update(dto: UpdateStudentDTO): Promise<Student> {
        const row = await prisma.student.update({
            where: { id: dto.id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.nickname !== undefined && { nickname: dto.nickname }),

                ...(dto.gender !== undefined && {
                    gender: GenderMapper.toPrisma(dto.gender),
                }),

                ...(dto.religionCode !== undefined && {
                    religionCode: dto.religionCode,
                }),

                ...(dto.rombelId !== undefined && {
                    rombelId: dto.rombelId,
                }),

                ...(dto.status !== undefined && {
                    status: StudentStatusMapper.toPrisma(dto.status),
                }),

                ...(dto.familyStatus !== undefined && {
                    familyStatus:
                        FamilyStatusMapper.toPrisma(dto.familyStatus),
                }),

                ...(dto.nis !== undefined && { nis: dto.nis }),
                ...(dto.nisn !== undefined && { nisn: dto.nisn }),

                ...(dto.isDifable !== undefined && {
                    isDifable: dto.isDifable,
                }),

                ...(dto.difableNotes !== undefined && {
                    difableNotes: dto.difableNotes,
                }),
            },
        });

        return StudentMapper.toDomain(row);
    }

    async softDelete(id: string) {
        await prisma.student.update({
            where: {id},
            data: {deletedAt: new Date()},
        });
    }

    async assignToRombel(studentId: string, rombelId: string): Promise<void> {
        await prisma.student.update({
            where: {
                id: studentId,
                deletedAt: null,
            },
            data: {
                rombelId,
            },
        });
    }

    async batchAssignToRombel(
        studentIds: string[],
        rombelId: string,
    ): Promise<number> {
        const result = await prisma.student.updateMany({
            where: {
                id: {in: studentIds},
                deletedAt: null,
            },
            data: {
                rombelId,
            },
        });

        return result.count;
    }
}
