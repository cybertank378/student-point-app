//Files: prisma/seed/student/studentFacility.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

import { fakerID_ID as faker } from "@faker-js/faker"

faker.seed(2101)

class StudentFacilitySeeder extends BaseSeeder {

    readonly name = "STUDENT_FACILITY_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const students = await tx.student.findMany({
                select: {
                    id: true
                }
            })

            const internetOptions = [
                "WiFi Rumah",
                "Data Seluler",
                "WiFi Tetangga",
                "Warnet",
                "Tidak Ada"
            ]

            const dataset: {
                studentId: string
                hasPC: boolean
                hasLaptop: boolean
                hasPhone: boolean
                internetAccess: string
            }[] = []

            for (const student of students) {

                const hasLaptop = faker.datatype.boolean({ probability: 0.45 })
                const hasPC = !hasLaptop && faker.datatype.boolean({ probability: 0.25 })
                const hasPhone = faker.datatype.boolean({ probability: 0.85 })

                dataset.push({

                    studentId: student.id,

                    hasPC,

                    hasLaptop,

                    hasPhone,

                    internetAccess: faker.helpers.arrayElement(internetOptions)

                })

            }

            await tx.studentFacility.createMany({

                data: dataset,

                skipDuplicates: true

            })

        })

    }

}

export default new StudentFacilitySeeder()