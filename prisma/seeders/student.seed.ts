// Files: prisma/seeders/student.seed.ts
import prisma from "@/libs/prisma";
import { fakerID_ID as faker } from "@faker-js/faker";
import {
    Class,
    Role,
    Gender,
    StudentStatus,
} from "@/generated/prisma";
import { generateFamilyStatus } from "../seeder_utils";

faker.seed(123);

export async function seedStudents(
    password: string,
    classes: Class[]
) {
    console.log("🔹 Seeding Students...");

    const religions = await prisma.religion.findMany({
        select: { kode: true },
    });

    const students = [];

    for (let i = 0; i < 50; i++) {
        const nis = faker.string.numeric(5);

        const student = await prisma.student.create({
            data: {
                nis,
                nisn: faker.string.numeric(17),
                name: faker.person.fullName(),
                nickname: faker.person.firstName(),
                gender: faker.helpers.arrayElement([
                    Gender.MALE,
                    Gender.FEMALE,
                ]),
                religionCode: religions[i % religions.length].kode,
                rombelId: classes[i % classes.length].id,
                status: StudentStatus.ACTIVE,
                familyStatus: generateFamilyStatus(),
                isDifable: faker.datatype.boolean({ probability: 0.1 }),
            },
        });

        await prisma.user.create({
            data: {
                username: nis,
                password,
                role: Role.STUDENT,
                studentId: student.id,
            },
        });

        students.push(student);
    }

    console.log("✅ Students seeded successfully.");
    return students;
}