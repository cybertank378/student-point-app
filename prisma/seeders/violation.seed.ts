//Files: prisma/seeders/violation.seed.ts

import prisma from "@/libs/prisma";
import { violationMaster } from "../seeder_utils";

export async function seedViolations() {
    console.log("🔹 Seeding Violation Master...");

    await prisma.violation.createMany({
        data: violationMaster,
        skipDuplicates: true,
    });
}