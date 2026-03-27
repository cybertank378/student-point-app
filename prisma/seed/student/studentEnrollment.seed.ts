import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"
import { EnrollmentStatus } from "@/generated/prisma"

class StudentEnrollmentSeeder extends BaseSeeder {

    readonly name = "STUDENT_ENROLLMENT_SEEDER"

    protected async seed(): Promise<void> {

        await prisma.$transaction(async (tx) => {

            const academicYear = await tx.academicYear.findFirst({
                where: { isActive: true }
            })

            if (!academicYear) {
                throw new Error("Active academic year not found")
            }

            const classes = await tx.class.findMany({
                where: {
                    academicYearId: academicYear.id
                },
                select: {
                    id: true
                },
                orderBy: {
                    grade: "asc"
                }
            })

            const students = await tx.student.findMany({
                where: {
                    deletedAt: null
                },
                select: {
                    id: true
                },
                orderBy: {
                    nis: "asc"
                }
            })

            const studentsPerClass = 30

            const enrollmentDataset: {
                studentId: string
                academicYearId: string
                classId: string
                status: EnrollmentStatus
            }[] = []

            const pointDataset: {
                studentId: string
                academicYearId: string
                totalViolationPoint: number
                totalAchievementPoint: number
                totalPoint: number
            }[] = []

            const aidDataset: {
                studentId: string
                academicYearId: string
                kjp: boolean
                pip: boolean
            }[] = []

            let studentIndex = 0

            for (const classItem of classes) {

                for (let i = 0; i < studentsPerClass; i++) {

                    const student = students[studentIndex]

                    if (!student) break

                    enrollmentDataset.push({
                        studentId: student.id,
                        academicYearId: academicYear.id,
                        classId: classItem.id,
                        status: EnrollmentStatus.ACTIVE
                    })

                    pointDataset.push({
                        studentId: student.id,
                        academicYearId: academicYear.id,
                        totalViolationPoint: 0,
                        totalAchievementPoint: 0,
                        totalPoint: 0
                    })

                    aidDataset.push({
                        studentId: student.id,
                        academicYearId: academicYear.id,
                        kjp: false,
                        pip: false
                    })

                    studentIndex++

                }

            }

            if (enrollmentDataset.length > 0) {
                await tx.studentEnrollment.createMany({
                    data: enrollmentDataset,
                    skipDuplicates: true
                })
            }

            if (pointDataset.length > 0) {
                await tx.studentPoint.createMany({
                    data: pointDataset,
                    skipDuplicates: true
                })
            }

            if (aidDataset.length > 0) {
                await tx.studentAid.createMany({
                    data: aidDataset,
                    skipDuplicates: true
                })
            }

        })

    }

}

export default new StudentEnrollmentSeeder()