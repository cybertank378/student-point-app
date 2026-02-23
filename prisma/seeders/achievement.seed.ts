//Files: prisma/seeders/achievement.seed.ts
import prisma from "@/libs/prisma";

export async function seedAchievements() {
    console.log("🔹 Seeding Achievements...");

    await prisma.achievement.createMany({
        data: [
            { name: "Juara 1 Olimpiade", point: 50 },
            { name: "Juara 2 Olimpiade", point: 40 },
            { name: "Juara 3 Olimpiade", point: 30 },
            { name: "Ketua OSIS", point: 35 },
        ],
        skipDuplicates: true,
    });
}