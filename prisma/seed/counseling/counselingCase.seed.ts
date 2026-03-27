//Files: prisma/seed/counseling/counselingCase.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

import {
    CaseSource,
    CaseStatus
} from "@/generated/prisma"

faker.seed(4002)

class CounselingCaseSeeder extends BaseSeeder {

    readonly name = "COUNSELING_CASE_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const academicYear = await tx.academicYear.findFirst({
                where: { isActive: true }
            })

            if (!academicYear) throw new Error("Active academic year not found")

            const students = await tx.student.findMany({
                select: { id: true }
            })

            const sources = Object.values(CaseSource)

            const dataset: {
                studentId: string
                academicYearId: string
                reason: string
                source: CaseSource
                status: CaseStatus
                openedAt: Date
                closedAt: Date | null
            }[] = []

            for (const student of students) {

                if (faker.datatype.boolean({ probability: 0.15 })) {

                    const openedAt = faker.date.recent({ days: 120 })

                    const closed = faker.datatype.boolean({ probability: 0.6 })

                    dataset.push({

                        studentId: student.id,

                        academicYearId: academicYear.id,

                        reason: faker.lorem.sentence(),

                        source: faker.helpers.arrayElement(sources),

                        status: closed
                            ? CaseStatus.CLOSED
                            : CaseStatus.IN_PROGRESS,

                        openedAt,

                        closedAt: closed
                            ? faker.date.soon({ days: 20, refDate: openedAt })
                            : null

                    })

                }

            }

            await tx.counselingCase.createMany({

                data: dataset,

                skipDuplicates: true

            })

        })

    }

}

export default new CounselingCaseSeeder()