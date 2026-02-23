//Files: prisma/seeders/admin.seed.ts

import prisma from "@/libs/prisma";
import { Role } from "@/generated/prisma";

export async function seedAdmin(password: string) {
    console.log("🔹 Seeding Admin...");

    await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password,
            role: Role.ADMIN,
        },
    });
}