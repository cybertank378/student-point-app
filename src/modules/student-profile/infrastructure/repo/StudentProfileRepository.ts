//Files: src/modules/student-profile/infrastructure/repo/StudentProfileRepository.ts


import type {StudentProfileInterface} from "@/modules/student-profile/domain/interfaces/StudentProfileInterface";

import type {CreateStudentProfileDTO} from "@/modules/student-profile/domain/dto/CreateStudentProfileDTO";
import type {UpdateStudentProfileDTO} from "@/modules/student-profile/domain/dto/UpdateStudentProfileDTO";
import prisma from "@/libs/prisma";
import {StudentProfileDTO} from "@/modules/student-profile/domain/dto/StudentProfileDTO";

/**
 * Prisma implementation of StudentProfileRepositoryInterface.
 *
 * This class acts as an **infrastructure adapter**
 * that bridges the domain layer with the database.
 *
 * @class StudentProfileRepository
 */
export class StudentProfileRepository implements StudentProfileInterface {

    async withTransaction<T>(
        callback: () => Promise<T>
    ): Promise<T> {

        return prisma.$transaction(async () => {
            return callback()
        })

    }


    async create(
        data: CreateStudentProfileDTO
    ): Promise<StudentProfileDTO> {

        return prisma.studentProfile.create({
            data
        })

    }

    async update(
        data: UpdateStudentProfileDTO
    ): Promise<StudentProfileDTO> {

        const { studentId, ...payload } = data

        return prisma.studentProfile.update({

            where: { studentId },

            data: payload

        })

    }

    async findByStudentId(
        studentId: string
    ): Promise<StudentProfileDTO | null> {

        return prisma.studentProfile.findUnique({
            where: { studentId }
        })

    }

    async delete(studentId: string): Promise<void> {

        await prisma.studentProfile.delete({
            where: { studentId }
        })

    }

}