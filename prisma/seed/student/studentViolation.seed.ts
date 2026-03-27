//Files: prisma/seed/student/studentViolation.seedRunner.ts
import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"
import { fakerID_ID as faker } from "@faker-js/faker"

faker.seed(3001)

class StudentViolationSeeder extends BaseSeeder {

    readonly name = "STUDENT_VIOLATION_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const academicYear = await tx.academicYear.findFirst({
                where: { isActive: true }
            })

            if (!academicYear) throw new Error("Active academic year not found")

            const students = await tx.student.findMany({
                select: { id: true }
            })

            const violations = await tx.violation.findMany({
                select: { id: true, point: true }
            })

            const dataset: {
                studentId: string
                violationId: string
                academicYearId: string
                point: number
                occurredAt: Date
            }[] = []

            for (const student of students) {

                const violationCount = faker.number.int({ min: 0, max: 5 })

                for (let i = 0; i < violationCount; i++) {

                    const violation = faker.helpers.arrayElement(violations)

                    dataset.push({

                        studentId: student.id,
                        violationId: violation.id,
                        academicYearId: academicYear.id,
                        point: violation.point,

                        occurredAt: faker.date.between({
                            from: academicYear.startDate,
                            to: academicYear.endDate
                        })

                    })

                }

            }

            await tx.studentViolation.createMany({
                data: dataset,
                skipDuplicates: true
            })

        })

    }

}

export default new StudentViolationSeeder()