//Files: prisma/seed/audit/systemAuditLog.seedRunner.ts

import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

import { Prisma } from "@/generated/prisma"

faker.seed(4003)

class SystemAuditLogSeeder extends BaseSeeder {

    readonly name = "SYSTEM_AUDIT_LOG_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const users = await tx.user.findMany({
                select: {
                    id: true,
                    role: true
                }
            })

            const entities = [
                "Student",
                "Violation",
                "Achievement",
                "Attendance",
                "CounselingCase"
            ]

            const actions = [
                "CREATE",
                "UPDATE",
                "DELETE"
            ]

            const dataset: Prisma.SystemAuditLogCreateManyInput[] = []

            for (let i = 0; i < 300; i++) {

                const user = faker.helpers.arrayElement(users)

                dataset.push({

                    actorId: user?.id ?? null,

                    actorRole: user?.role ?? null,

                    entity: faker.helpers.arrayElement(entities),

                    entityId: faker.string.uuid(),

                    action: faker.helpers.arrayElement(actions),

                    before: Prisma.JsonNull,

                    after: Prisma.JsonNull,

                    ip: faker.internet.ip(),

                    userAgent: faker.internet.userAgent()

                })

            }

            await tx.systemAuditLog.createMany({

                data: dataset,

                skipDuplicates: true

            })

        })

    }

}

export default new SystemAuditLogSeeder()