//Files: prisma/seed/student/studentAchievement.seedRunner.ts
import { fakerID_ID as faker } from "@faker-js/faker";
import prisma from "@/libs/prisma";
import { BaseSeeder } from "../BaseSeeder";

faker.seed(3003);

class StudentAchievementSeeder extends BaseSeeder {
  readonly name = "STUDENT_ACHIEVEMENT_SEEDER";

  protected async seed(): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const students = await tx.student.findMany({
        select: { id: true },
      });

      const achievements = await tx.achievement.findMany({
        select: { id: true, point: true },
      });

      const academicYears = await tx.academicYear.findMany({
        select: { id: true },
      });

      const dataset: {
        studentId: string;
        achievementId: string;
        academicYearId: string;
        point: number;
        achievedAt: Date;
      }[] = [];

      for (const student of students) {
        const achievementCount = faker.number.int({ min: 0, max: 3 });

        for (let i = 0; i < achievementCount; i++) {
          const achievement = faker.helpers.arrayElement(achievements);

          const academicYear = faker.helpers.arrayElement(academicYears);

          dataset.push({
            studentId: student.id,

            achievementId: achievement.id,

            academicYearId: academicYear.id,

            point: achievement.point,

            achievedAt: faker.date.recent({
              days: 180,
            }),
          });
        }
      }

      await tx.studentAchievement.createMany({
        data: dataset,
        skipDuplicates: true,
      });
    });
  }
}

export default new StudentAchievementSeeder();
