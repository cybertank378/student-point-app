import prisma from "@/libs/prisma";
import { hashPassword } from "./seeder_utils";

import { seedReligions } from "./seeders/religion.seed";
import { seedAcademicYear } from "./seeders/academic.seed";
import { seedClasses } from "./seeders/class.seed";
import { seedAdmin } from "./seeders/admin.seed";
import { seedTeachers } from "./seeders/teacher.seed";
import { seedParents } from "./seeders/parent.seed";
import { seedStudents } from "./seeders/student.seed";
import { seedViolations } from "./seeders/violation.seed";
import { seedAchievements } from "./seeders/achievement.seed";

async function main() {
    console.log("🌱 ENTERPRISE SCHOOL SEED START");

    const password = await hashPassword("password123");

    // ❌ HAPUS prisma.$transaction
    await seedReligions();

    const academicYear = await seedAcademicYear();
    const classes = await seedClasses(academicYear.id);

    await seedAdmin(password);
    await seedTeachers(password);

    await seedStudents(password, classes);
    await seedParents(password);

    await seedViolations();
    await seedAchievements();

    console.log("🎉 ALL SEEDERS EXECUTED SUCCESSFULLY");
}

main()
    .catch((e) => {
        console.error("❌ SEED ERROR:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });