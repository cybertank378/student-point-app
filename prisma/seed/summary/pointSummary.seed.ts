import prisma from "@/libs/prisma"
import { BaseSeeder } from "../BaseSeeder"

class PointSummarySeeder extends BaseSeeder {

    readonly name = "POINT_SUMMARY_SEEDER"

    protected async seed(): Promise<void> {

        const academicYear = await prisma.academicYear.findFirst({
            where: { isActive: true }
        })

        if (!academicYear) {
            throw new Error("Active academic year not found")
        }

        const students = await prisma.student.findMany({
            where: { deletedAt: null },
            select: { id: true }
        })

        const violationAgg = await prisma.studentViolation.groupBy({
            by: ["studentId"],
            where: {
                academicYearId: academicYear.id
            },
            _sum: {
                point: true
            }
        })

        const achievementAgg = await prisma.studentAchievement.groupBy({
            by: ["studentId"],
            _sum: {
                point: true
            }
        })

        const violationMap = new Map(
            violationAgg.map(v => [v.studentId, v._sum.point ?? 0])
        )

        const achievementMap = new Map(
            achievementAgg.map(a => [a.studentId, a._sum.point ?? 0])
        )

        const dataset = students.map(student => {

            const violationPoint = violationMap.get(student.id) ?? 0
            const achievementPoint = achievementMap.get(student.id) ?? 0

            return {

                studentId: student.id,

                academicYearId: academicYear.id,

                totalViolationPoint: violationPoint,

                totalAchievementPoint: achievementPoint,

                totalPoint: achievementPoint - violationPoint

            }

        })

        if (dataset.length === 0) return

        await prisma.studentPoint.createMany({

            data: dataset,

            skipDuplicates: true

        })

    }

}

export default new PointSummarySeeder()