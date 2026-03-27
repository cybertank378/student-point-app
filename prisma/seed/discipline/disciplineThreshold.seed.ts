//Files: prisma/seed/discipline/disciplineThreshold.seedRunner.ts

//Files: prisma/seed/discipline/disciplineThreshold.seedRunner.ts

import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { DisciplineActionType } from "@/generated/prisma"

class DisciplineThresholdSeeder extends BaseSeeder {

    readonly name = "DISCIPLINE_THRESHOLD_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const academicYears = await tx.academicYear.findMany({
                select: { id: true }
            })

            if (academicYears.length === 0) {
                throw new Error("AcademicYear not seeded")
            }

            const thresholds = [
                { minPoint: 20, actionType: DisciplineActionType.WARNING_1 },
                { minPoint: 40, actionType: DisciplineActionType.WARNING_2 },
                { minPoint: 60, actionType: DisciplineActionType.CALL_BK },
                { minPoint: 80, actionType: DisciplineActionType.CALL_PARENT },
                { minPoint: 100, actionType: DisciplineActionType.DISCIPLINE_HEARING }
            ]

            const dataset: {
                academicYearId: string
                minPoint: number
                actionType: DisciplineActionType
            }[] = []

            for (const year of academicYears) {

                for (const rule of thresholds) {

                    dataset.push({
                        academicYearId: year.id,
                        minPoint: rule.minPoint,
                        actionType: rule.actionType
                    })

                }

            }

            await tx.disciplineThreshold.createMany({
                data: dataset,
                skipDuplicates: true
            })

        })

    }

}

export default new DisciplineThresholdSeeder()