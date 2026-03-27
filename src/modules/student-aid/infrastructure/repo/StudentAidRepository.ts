//Files: src/modules/student-aid/infrastructure/repo/StudentAidRepository.ts

import prisma from "@/libs/prisma";
import {StudentAidDTO} from "@/modules/student-aid/domain/dto/StudentAidDTO";
import {StudentAidInterface} from "@/modules/student-aid/domain/interfaces/StudentAidInterface";

/**
 * ============================================================
 * STUDENT AID REPOSITORY
 * ============================================================
 *
 * Prisma adapter implementing StudentAidInterface.
 */

export class StudentAidRepository implements StudentAidInterface {

    async withTransaction<T>(
        callback: () => Promise<T>
    ): Promise<T> {

        return prisma.$transaction(async () => {
            return callback()
        })

    }

    async assign(
        data: Omit<StudentAidDTO, "id">
    ): Promise<StudentAidDTO> {

        return prisma.studentAid.create({
            data
        })

    }

    async update(
        data: StudentAidDTO
    ): Promise<StudentAidDTO> {

        const { id, ...payload } = data

        return prisma.studentAid.update({
            where: { id },
            data: payload
        })

    }

    async findByStudent(
        studentId: string
    ): Promise<StudentAidDTO[]> {

        return prisma.studentAid.findMany({
            where: { studentId }
        })

    }

    async findByStudentAndYear(
        studentId: string,
        academicYearId: string
    ): Promise<StudentAidDTO | null> {

        return prisma.studentAid.findUnique({
            where: {
                studentId_academicYearId: {
                    studentId,
                    academicYearId
                }
            }
        })

    }

}