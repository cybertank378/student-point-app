//Files: prisma/seed/master/academicYear.seedRunner.ts
import prisma from "@/libs/prisma";
import { BaseSeeder } from "../BaseSeeder";

class AcademicYearSeeder extends BaseSeeder {
  readonly name = "MASTER_ACADEMIC_YEAR";

  protected async seed(): Promise<void> {
    /**
     * Dataset deterministic
     * - 1 active academic year
     * - 1 inactive academic year
     */

    const dataset = [
      {
        name: "2023/2024",
        startDate: new Date("2023-07-01"),
        endDate: new Date("2024-06-30"),
        isActive: false,
      },
      {
        name: "2024/2025",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2025-06-30"),
        isActive: true,
      },
    ];

    /**
     * Ensure idempotent behavior
     * Use upsert based on a unique field (name)
     */

    for (const year of dataset) {
      await prisma.academicYear.upsert({
        where: {
          name: year.name,
        },

        update: {
          startDate: year.startDate,
          endDate: year.endDate,
          isActive: year.isActive,
        },

        create: {
          name: year.name,
          startDate: year.startDate,
          endDate: year.endDate,
          isActive: year.isActive,
        },
      });
    }

    /**
     * Safety Guard
     * Ensure only ONE academic year is active
     */

    const activeYears = await prisma.academicYear.findMany({
      where: { isActive: true },
    });

    if (activeYears.length > 1) {
      const [first, ...others] = activeYears;

      await prisma.academicYear.updateMany({
        where: {
          id: {
            in: others.map((y) => y.id),
          },
        },
        data: {
          isActive: false,
        },
      });
    }
  }
}

export default new AcademicYearSeeder();
