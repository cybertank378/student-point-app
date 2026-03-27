//Files: src/modules/student/domain/builder/StatisticQueryBuilder.ts
import { Prisma } from "@/generated/prisma";

export class StatisticQueryBuilder {
  /**
   * TOTAL STUDENTS
   */
  static totalStudents = Prisma.validator<Prisma.StudentCountArgs>()({
    where: {
      deletedAt: null,
    },
  });

  /**
   * GRADE DISTRIBUTION
   */
  static gradeDistribution = Prisma.validator<Prisma.StudentEnrollmentGroupByArgs>()({
    by: ["classId"],

    where: {
      deletedAt: null,
      status: "ACTIVE",
    },

    _count: {
      studentId: true,
    },

    orderBy: {
      classId: "asc",
    },
  });
  /**
   * VIOLATION DATA
   */
  static violations = Prisma.validator<Prisma.StudentViolationFindManyArgs>()({
    select: {
      occurredAt: true,
      student: {
        select: {
          enrollments: {
            where: {
              status: "ACTIVE",
              deletedAt: null,
            },

            take: 1,

            select: {
              class: {
                select: {
                  grade: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
