//Files: src/modules/student-counseling/infrastructure/repo/StudentCounselingRepository.ts
/**
 * ============================================================
 * ADAPTER REPOSITORY KASUS KONSELING SISWA
 * ============================================================
 *
 * Implementasi repository pada layer infrastructure yang
 * bertanggung jawab melakukan operasi persistence terhadap
 * entitas StudentCounselingCase menggunakan Prisma ORM.
 *
 * Repository ini merupakan Adapter pada Hexagonal Architecture
 * yang menghubungkan Domain Layer dengan database.
 *
 * Prinsip Arsitektur
 * - Domain bergantung pada Repository Interface
 * - Infrastructure mengimplementasikan Repository Interface
 * - Prisma digunakan sebagai ORM
 *
 * Catatan Penting
 * - Modul child tidak menyediakan operasi READ list
 * - Operasi READ agregasi dilakukan oleh StudentComposite
 */
import prisma from "@/libs/prisma"

import {
    StudentCounselingCase
} from "@/modules/student-counseling/domain/entity/StudentCounselingCase"

import {
    StudentCounselingCaseMapper
} from "@/modules/student-counseling/domain/mapper/StudentCounselingCaseMapper"

import {
    StudentCounselingCaseInterface
} from "@/modules/student-counseling/domain/interfaces/StudentCounselingCaseInterface"

/**
 * ============================================================
 * STUDENT COUNSELING REPOSITORY
 * ============================================================
 *
 * Adapter infrastructure yang menghubungkan domain
 * StudentCounselingCase dengan Prisma ORM.
 *
 * Catatan Arsitektur
 * - Repository hanya menangani operasi WRITE
 * - Operasi READ agregasi dilakukan oleh StudentComposite
 */

export class StudentCounselingRepository implements StudentCounselingCaseInterface {

    async create(
        entity: StudentCounselingCase
    ): Promise<StudentCounselingCase> {

        const record = await prisma.counselingCase.create({
            data: {
                id: entity.id,
                studentId: entity.studentId,
                academicYearId: entity.academicYearId,
                reason: entity.reason,
                source: entity.source,
                status: entity.status,
                openedAt: entity.openedAt,
                closedAt: entity.closedAt
            }
        })

        return StudentCounselingCaseMapper.fromPrisma(record)

    }

    async update(
        entity: StudentCounselingCase
    ): Promise<StudentCounselingCase> {

        const record = await prisma.counselingCase.update({
            where: { id: entity.id },
            data: {
                reason: entity.reason,
                status: entity.status,
                closedAt: entity.closedAt
            }
        })

        return StudentCounselingCaseMapper.fromPrisma(record)

    }

    async findById(
        id: string
    ): Promise<StudentCounselingCase | null> {

        const record = await prisma.counselingCase.findUnique({
            where: { id }
        })

        if (!record) return null

        return StudentCounselingCaseMapper.fromPrisma(record)

    }

}