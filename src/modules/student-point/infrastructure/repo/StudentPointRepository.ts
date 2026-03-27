//Files: src/modules/student-point/infrastructure/repo/StudentPointRepository.ts


import prisma from "@/libs/prisma"

import { StudentPointInterface } from "@/modules/student-point//domain/interfaces/StudentPointInterface"
import { StudentPoint } from "@/modules/student-point//domain/entity/StudentPoint"

/**
 * ============================================================
 * STUDENT POINT REPOSITORY
 * ============================================================
 *
 * Infrastructure adapter untuk modul Student Point.
 *
 * Repository ini mengimplementasikan StudentPointInterface
 * dan bertanggung jawab untuk komunikasi dengan database
 * melalui Prisma ORM.
 *
 * Responsibilities:
 *
 * - Mengambil summary poin siswa
 * - Membuat summary awal siswa
 * - Menyimpan perubahan summary
 * - Mengambil daftar ranking siswa
 *
 * Repository tidak mengekspos Prisma type
 * ke domain layer.
 */

export class StudentPointRepository implements StudentPointInterface {
    async findByStudentAndAcademicYear(
        studentId: string,
        academicYearId: string
    ): Promise<StudentPoint | null> {

        const record = await prisma.studentPoint.findUnique({

            where: {
                studentId_academicYearId: {
                    studentId,
                    academicYearId
                }
            }

        })

        if (!record) return null

        return new StudentPoint(record)

    }

    async listByAcademicYear(
        academicYearId: string
    ): Promise<StudentPoint[]> {

        const records = await prisma.studentPoint.findMany({

            where: { academicYearId },

            orderBy: {
                totalPoint: "desc"
            }

        })

        return records.map((r) => new StudentPoint(r))

    }

    async save(entity: StudentPoint): Promise<StudentPoint> {

        const record = await prisma.studentPoint.update({

            where: {
                id: entity.id
            },

            data: {

                totalViolationPoint: entity.totalViolationPoint,
                totalAchievementPoint: entity.totalAchievementPoint,
                totalPoint: entity.totalPoint

            }

        })

        return new StudentPoint(record)

    }

}