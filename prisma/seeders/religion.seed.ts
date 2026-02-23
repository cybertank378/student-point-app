//Files: prisma/seeders/religion.seed.ts
import prisma from "@/libs/prisma";

export async function seedReligions() {
    console.log("🔹 Seeding Religions...");

    await prisma.religion.createMany({
        data: [
            { kode: "ISL", name: "Islam" },
            { kode: "KRI", name: "Kristen" },
            { kode: "KAT", name: "Katolik" },
            { kode: "HIN", name: "Hindu" },
            { kode: "BUD", name: "Buddha" },
            { kode: "KON", name: "Konghucu" },
        ],
        skipDuplicates: true,
    });
}