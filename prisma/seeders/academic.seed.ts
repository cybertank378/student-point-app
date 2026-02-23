//Files: prisma/seeders/academic.seed.ts

import prisma from "@/libs/prisma";

export async function seedAcademicYear() {
    console.log("🔹 Seeding Academic Year...");

    return prisma.academicYear.upsert({
        where: { name: "2024/2025" },
        update: {},
        create: {
            name: "2024/2025",
            startDate: new Date("2024-07-01"),
            endDate: new Date("2025-06-30"),
            isActive: true,
        },
    });
}