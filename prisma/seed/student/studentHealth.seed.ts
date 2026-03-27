//Files: prisma/seed/student/studentHealth.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

faker.seed(2401)

class StudentHealthSeeder extends BaseSeeder {

    readonly name = "STUDENT_HEALTH_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const students = await tx.student.findMany({
                select: {
                    id: true,
                    isDifable: true
                }
            })

            const diseases = [
                "Asma",
                "Alergi debu",
                "Alergi makanan",
                "Rabun jauh",
                "Rabun dekat",
                "Anemia ringan"
            ]

            const dataset: {
                studentId: string
                inclusion: boolean
                canRead: boolean
                canWrite: boolean
                canCount: boolean
                canSpeak: boolean
                canFollowCeremony: boolean
                canDoSport: boolean
                canSeeBoard: boolean
                canHearClearly: boolean
                canWalkRun: boolean
                canHoldPen: boolean
                dominantHandRight: boolean
                diseaseHistory: string | null
                hasPsychologistLetter: boolean
                hasIQTest: boolean
                iqScore: number | null
            }[] = []

            for (const student of students) {

                const inclusion = student.isDifable

                const hasIQTest = faker.datatype.boolean({ probability: 0.6 })

                dataset.push({

                    studentId: student.id,

                    inclusion,

                    canRead: !inclusion || faker.datatype.boolean({ probability: 0.8 }),
                    canWrite: !inclusion || faker.datatype.boolean({ probability: 0.8 }),
                    canCount: !inclusion || faker.datatype.boolean({ probability: 0.8 }),
                    canSpeak: faker.datatype.boolean({ probability: 0.95 }),

                    canFollowCeremony: faker.datatype.boolean({ probability: 0.9 }),
                    canDoSport: faker.datatype.boolean({ probability: 0.85 }),
                    canSeeBoard: faker.datatype.boolean({ probability: 0.9 }),
                    canHearClearly: faker.datatype.boolean({ probability: 0.95 }),
                    canWalkRun: faker.datatype.boolean({ probability: 0.9 }),
                    canHoldPen: faker.datatype.boolean({ probability: 0.95 }),

                    dominantHandRight: faker.datatype.boolean({ probability: 0.9 }),

                    diseaseHistory: faker.datatype.boolean({ probability: 0.15 })
                        ? faker.helpers.arrayElement(diseases)
                        : null,

                    hasPsychologistLetter: inclusion
                        ? faker.datatype.boolean({ probability: 0.7 })
                        : false,

                    hasIQTest,

                    iqScore: hasIQTest
                        ? faker.number.int({
                            min: 80,
                            max: 130
                        })
                        : null

                })

            }

            await tx.studentHealthAbility.createMany({

                data: dataset,

                skipDuplicates: true

            })

        })

    }

}

export default new StudentHealthSeeder()