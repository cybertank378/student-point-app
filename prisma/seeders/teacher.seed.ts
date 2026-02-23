// Files: prisma/seeders/teacher.seed.ts

import prisma from "@/libs/prisma";
import { fakerID_ID as faker } from "@faker-js/faker";
import {
    Role,
    Gender,
    EducationLevel,
    CivilServantRank,
    TeacherRole,
} from "@/generated/prisma";

import {
    generateIndonesianPhone,
    generateIndonesianNip,
    generateNuptk,
    generateNRK,
    generateNRG,
    generateTeacherEmail,
    generateTeacherName,
} from "../seeder_utils";

faker.seed(123);

function generateTeacherRoles(): TeacherRole[] {
    const roles = [
        TeacherRole.SUBJECT_TEACHER,
        TeacherRole.HOMEROOM,
        TeacherRole.COUNSELOR,
        TeacherRole.DUTY_TEACHER,
    ];

    return faker.helpers.arrayElements(roles, {
        min: 1,
        max: 2,
    });
}

export async function seedTeachers(password: string) {
    console.log("🔹 Seeding Teachers (Schema-Aligned Version)...");

    const religions = await prisma.religion.findMany({
        select: { kode: true },
    });

    if (religions.length === 0) {
        throw new Error("Religion data not found.");
    }

    // Ambil semua class (sudah mengandung academicYearId)
    const classes = await prisma.class.findMany({
        select: {
            id: true,
            academicYearId: true,
            homeroomTeacherId: true,
        },
    });

    for (let i = 0; i < 10; i++) {
        await prisma.$transaction(async (tx) => {
            const name = generateTeacherName();

            const nip = await generateIndonesianNip(tx);
            const nuptk = await generateNuptk(tx);
            const nrk = await generateNRK(tx);

            const nrg = generateNRG(2015, 101, i + 1);

            const teacherRoles = generateTeacherRoles();

            const teacher = await tx.teacher.upsert({
                where: { nrg },
                update: {},
                create: {
                    nip,
                    nuptk,
                    nrk,
                    nrg,
                    name,
                    gender: faker.helpers.arrayElement([
                        Gender.MALE,
                        Gender.FEMALE,
                    ]),
                    religionCode: religions[i % religions.length].kode,
                    phone: generateIndonesianPhone(),
                    email: generateTeacherEmail(name),
                    educationLevel: EducationLevel.S1,
                    major: "Pendidikan",
                    graduationYear: 2015,
                    birthPlace: faker.location.city(),
                    birthDate: faker.date.birthdate({
                        min: 25,
                        max: 50,
                        mode: "age",
                    }),
                    civilServantRank: CivilServantRank.III_A,
                    isPns: true,
                    roles: teacherRoles,
                },
            });

            // 🔥 ASSIGN HOMEROOM (UPDATE CLASS)
            // hanya kalau teacher punya role HOMEROOM
            if (
                teacherRoles.includes(TeacherRole.HOMEROOM) &&
                classes.length > 0
            ) {
                const availableClass = classes.find(
                    (c) => !c.homeroomTeacherId
                );

                if (availableClass) {
                    await tx.class.update({
                        where: { id: availableClass.id },
                        data: {
                            homeroomTeacherId: teacher.id,
                        },
                    });
                }
            }

            // LOGIN USER
            await tx.user.upsert({
                where: { username: teacher.nrg },
                update: {},
                create: {
                    username: teacher.nrg,
                    password,
                    role: Role.TEACHER,
                    teacherId: teacher.id,
                },
            });
        });
    }

    console.log("✅ Teachers seeded successfully.");
}