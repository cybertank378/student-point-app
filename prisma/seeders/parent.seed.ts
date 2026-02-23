// Files: prisma/seeders/parent.seed.ts

import prisma from "@/libs/prisma";
import { fakerID_ID as faker } from "@faker-js/faker";
import {
    Parent,
    Role,
    ParentType,
    FamilyStatus,
} from "@/generated/prisma";
import { generateIndonesianPhone } from "../seeder_utils";

faker.seed(123);

/**
 * Mapping FamilyStatus → Roles
 * 🔥 Tidak ada magic number
 * 🔥 Pure domain mapping
 */
const FAMILY_ROLE_MAP: Record<FamilyStatus, ParentType[]> = {
    [FamilyStatus.COMPLETE]: [
        ParentType.FATHER,
        ParentType.MOTHER,
    ],
    [FamilyStatus.SINGLE_MOTHER]: [
        ParentType.MOTHER,
    ],
    [FamilyStatus.SINGLE_FATHER]: [
        ParentType.FATHER,
    ],
    [FamilyStatus.ORPHAN]: [
        ParentType.GUARDIAN,
    ],
};

export async function seedParents(
    password: string
): Promise<Parent[]> {

    console.log("🔹 Seeding Parents (SYNC WITH STUDENT)...");

    const religions = await prisma.religion.findMany({
        select: { kode: true },
    });

    // 🔥 Ambil langsung dari DB supaya selalu sinkron
    const students = await prisma.student.findMany({
        select: {
            id: true,
            nis: true,
            familyStatus: true,
        },
    });

    const parents: Parent[] = [];

    const roleInitialMap: Record<ParentType, string> = {
        [ParentType.FATHER]: "F",
        [ParentType.MOTHER]: "M",
        [ParentType.GUARDIAN]: "G",
    };

    for (const student of students) {

        const rolesToCreate =
            FAMILY_ROLE_MAP[student.familyStatus];

        for (const role of rolesToCreate) {

            // 🔒 Idempotent check
            const existingPivot =
                await prisma.studentParent.findFirst({
                    where: {
                        studentId: student.id,
                        role,
                    },
                });

            if (existingPivot) continue;


            const parent = await prisma.parent.create({
                data: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    education: "SMA",
                    job: faker.person.jobTitle(),
                    income: "5.000.000",
                    religionCode:
                    religions[
                        faker.number.int({
                            min: 0,
                            max: religions.length - 1,
                        })
                        ].kode,
                    phone : generateIndonesianPhone(),
                    address: faker.location.streetAddress(),
                },
            });

            parents.push(parent);

            // 🔗 Pivot
            await prisma.studentParent.create({
                data: {
                    studentId: student.id,
                    parentId: parent.id,
                    role,
                },
            });

            const username =
                `${roleInitialMap[role]}-${student.nis}`;

            await prisma.user.upsert({
                where: { username },
                update: {},
                create: {
                    username,
                    password,
                    role: Role.PARENT,
                    parentId: parent.id,
                },
            });
        }
    }

    console.log("✅ Parents seeded successfully.");
    return parents;
}