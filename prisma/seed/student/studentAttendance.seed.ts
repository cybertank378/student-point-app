//Files: prisma/seed/student/studentAttendance.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"
import { fakerID_ID as faker } from "@faker-js/faker"

import { AttendanceStatus } from "@/generated/prisma"

faker.seed(3002)

class StudentAttendanceSeeder extends BaseSeeder {

    readonly name = "STUDENT_ATTENDANCE_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const students = await tx.student.findMany({
                select: { id: true }
            })

            const days = 30

            const dataset: {
                studentId: string
                date: Date
                status: AttendanceStatus
                note: string | null
            }[] = []

            for (const student of students) {

                for (let i = 0; i < days; i++) {

                    const date = faker.date.recent({ days: 60 })

                    const status = faker.helpers.weightedArrayElement([
                        { weight: 85, value: AttendanceStatus.ALPHA },
                        { weight: 10, value: AttendanceStatus.IZIN },
                        { weight: 5, value: AttendanceStatus.SAKIT }
                    ])

                    dataset.push({

                        studentId: student.id,

                        date,

                        status,

                        note: status !== AttendanceStatus.ALPHA
                            ? "Keterangan wali"
                            : null

                    })

                }

            }

            await tx.studentAttendance.createMany({
                data: dataset,
                skipDuplicates: true
            })

        })

    }

}

export default new StudentAttendanceSeeder()