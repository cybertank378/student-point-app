//Files: prisma/seed/discipline/violationResolution.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

import {
    ViolationResolutionStatus,
    ViolationActionType
} from "@/generated/prisma"

faker.seed(4001)

class ViolationResolutionSeeder extends BaseSeeder {

    readonly name = "VIOLATION_RESOLUTION_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const violations = await tx.studentViolation.findMany({
                select: {
                    id: true
                }
            })

            const teachers = await tx.teacher.findMany({
                select: {
                    id: true
                }
            })

            const dataset: {
                studentViolationId: string
                handlerTeacherId: string
                status: ViolationResolutionStatus
                action: ViolationActionType
                note: string | null
                resolvedAt: Date | null
            }[] = []

            const actions = Object.values(ViolationActionType)

            for (const violation of violations) {

                if (faker.datatype.boolean({ probability: 0.7 })) {

                    const teacher = faker.helpers.arrayElement(teachers)

                    const action = faker.helpers.arrayElement(actions)

                    const resolved = faker.datatype.boolean({ probability: 0.8 })

                    dataset.push({

                        studentViolationId: violation.id,

                        handlerTeacherId: teacher.id,

                        status: resolved
                            ? ViolationResolutionStatus.RESOLVED
                            : ViolationResolutionStatus.IN_PROGRESS,

                        action,

                        note: faker.lorem.sentence(),

                        resolvedAt: resolved
                            ? faker.date.recent({ days: 30 })
                            : null

                    })

                }

            }

            for (const item of dataset) {

                await tx.violationResolution.upsert({

                    where: {
                        studentViolationId: item.studentViolationId
                    },

                    update: item,

                    create: item

                })

            }

        })

    }

}

export default new ViolationResolutionSeeder()