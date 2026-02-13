//Files: src/modules/student/infrastructure/repo/StudentRepository.ts

import  prisma  from "@/libs/prisma";

import {StudentStatusMapper} from "@/modules/student/domain/mapper/StudentStatusMapper";
import {StudentMapper} from "@/modules/student/domain/mapper/StudentMapper";
import {GenderMapper} from "@/modules/student/domain/mapper/GenderMapper";
import {UpdateStudentDTO} from "@/modules/student/domain/dto/UpdateStudentDTO";
import {StudentInterface} from "@/modules/student/domain/interfaces/StudentInterface";
import {StudentQueryDTO} from "@/modules/student/domain/dto/StudentQueryDTO";
import {CreateStudentDTO} from "@/modules/student/domain/dto/CreateStudentDTO";
import {Student} from "@/modules/student/domain/entity/Student";

export class StudentRepository implements StudentInterface {

    async findAll(query?: StudentQueryDTO) {
        const rows = await prisma.student.findMany({
            where: {
                deletedAt: null,
                ...(query?.rombelId && { rombelId: query.rombelId }),
                ...(query?.status && {
                    status: StudentStatusMapper.toPrisma(query.status),
                }),
            },
        });

        return rows.map(StudentMapper.toDomain);
    }

    async findById(id: string) {
        const row = await prisma.student.findFirst({
            where: { id, deletedAt: null },
        });

        return row ? StudentMapper.toDomain(row) : null;
    }

    async findByNis(nis: number) {
        const row = await prisma.student.findUnique({ where: { nis } });
        return row ? StudentMapper.toDomain(row) : null;
    }

    async create(
        dto: CreateStudentDTO,
    ): Promise<Student> {
        const row = await prisma.student.create({
            data: {
                nis: dto.nis,
                nisn: dto.nisn,
                name: dto.name,
                nickname: dto.nickname ?? null,
                gender: GenderMapper.toPrisma(dto.gender),
                religionId: dto.religionId,
                rombelId: dto.rombelId,
            },
        });

        return StudentMapper.toDomain(row);
    }

    async update(dto: UpdateStudentDTO) {
        const row = await prisma.student.update({
            where: { id: dto.id },
            data: {
                name: dto.name,
                nickname: dto.nickname,
                gender: dto.gender && GenderMapper.toPrisma(dto.gender),
                religionId: dto.religionId,
                rombelId: dto.rombelId,
                status: dto.status && StudentStatusMapper.toPrisma(dto.status),
            },
        });

        return StudentMapper.toDomain(row);
    }

    async softDelete(id: string) {
        await prisma.student.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async assignToRombel(
        studentId: string,
        rombelId: string,
    ): Promise<void> {
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
                id: { in: studentIds },
                deletedAt: null,
            },
            data: {
                rombelId,
            },
        });

        return result.count;
    }

}