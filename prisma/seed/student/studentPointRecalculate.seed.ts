//Files: prisma/seed/student/studentPointRecalculate.seed.ts
import prisma from "@/libs/prisma";
import { BaseSeeder } from "../BaseSeeder";

class StudentPointRecalculateSeeder extends BaseSeeder {
  readonly name = "STUDENT_POINT_RECALCULATE_SEEDER";

  protected async seed(): Promise<void> {
    const summaries = await prisma.studentPoint.findMany({
      select: {
        id: true,
        studentId: true,
        academicYearId: true,
      },
    });

    for (const summary of summaries) {
      const violations = await prisma.studentViolation.aggregate({
        where: {
          studentId: summary.studentId,
          academicYearId: summary.academicYearId,
        },
        _sum: { point: true },
      });

      const achievements = await prisma.studentAchievement.aggregate({
        where: {
          studentId: summary.studentId,
          academicYearId: summary.academicYearId,
        },
        _sum: { point: true },
      });

      const violationPoint = violations._sum.point ?? 0;
      const achievementPoint = achievements._sum.point ?? 0;

      const totalPoint = achievementPoint - violationPoint;

      await prisma.studentPoint.update({
        where: { id: summary.id },
        data: {
          totalViolationPoint: violationPoint,
          totalAchievementPoint: achievementPoint,
          totalPoint,
        },
      });
    }
  }
}

export default new StudentPointRecalculateSeeder();
