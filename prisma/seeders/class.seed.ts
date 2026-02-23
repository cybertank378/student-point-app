//Files: prisma/seeders/class.seed.ts

import prisma from "@/libs/prisma";
import { Class } from "@/generated/prisma";

export async function seedClasses(
    academicYearId: string
): Promise<Class[]> {
    console.log("🔹 Seeding Classes...");

    const classes: Class[] = [];

    for (const grade of ["VII", "VIII", "IX"] as const) {
        for (const name of ["1", "2"] as const) {
            const c = await prisma.class.upsert({
                where: {
                    grade_name_academicYearId: {
                        grade,
                        name,
                        academicYearId,
                    },
                },
                update: {},
                create: {
                    grade,
                    name,
                    academicYearId,
                },
            });

            classes.push(c);
        }
    }

    return classes;
}