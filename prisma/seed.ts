import prisma from "@/libs/prisma";
import { fakerID_ID as faker } from "@faker-js/faker";

import {
    Role,
    Gender,
    StudentStatus,
    ParentType,
    TeacherRole,
    ViolationResolutionStatus,
    ViolationActionType,
    EducationLevel,
    CivilServantRank,
} from "@/generated/prisma";

import {
    hashPassword,
    generateTeacherName,
    generateTeacherEmail,
    generateIndonesianPhone,
    generateIndonesianNip,
    violationMaster,
} from "./seeder_utils";

faker.seed(123);

function generateTeacherRoles(): TeacherRole[] {
    return [
        TeacherRole.SUBJECT_TEACHER,
        ...(faker.datatype.boolean() ? [TeacherRole.DUTY_TEACHER] : []),
        ...(faker.datatype.boolean({ probability: 0.2 })
            ? [TeacherRole.COUNSELOR]
            : []),
    ];
}

async function main() {
    console.log("🌱 FULL SCHOOL DATABASE SEED START");

    const password = await hashPassword("password123");

    await prisma.$transaction(async (tx) => {
        //////////////////////////////////////////////////////
        // 1️⃣ RELIGIONS (UPSERT ALL)
        //////////////////////////////////////////////////////
        const religionsData = [
            { kode: "ISL", name: "Islam" },
            { kode: "KRI", name: "Kristen" },
            { kode: "KAT", name: "Katolik" },
            { kode: "HIN", name: "Hindu" },
            { kode: "BUD", name: "Buddha" },
            { kode: "KON", name: "Konghucu" },
        ];

        for (const r of religionsData) {
            await tx.religion.upsert({
                where: { kode: r.kode },
                update: {},
                create: r,
            });
        }

        const religions: { kode: string }[] =
            await tx.religion.findMany({
                select: { kode: true },
            });

        //////////////////////////////////////////////////////
        // 2️⃣ ACADEMIC YEAR
        //////////////////////////////////////////////////////
        const academicYear = await tx.academicYear.upsert({
            where: { name: "2024/2025" },
            update: {},
            create: {
                name: "2024/2025",
                startDate: new Date("2024-07-01"),
                endDate: new Date("2025-06-30"),
                isActive: true,
            },
        });

        //////////////////////////////////////////////////////
        // 3️⃣ CLASS
        //////////////////////////////////////////////////////
        const classes = [];

        for (const grade of ["VII", "VIII", "IX"]) {
            for (const name of ["1", "2"]) {
                const c = await tx.class.upsert({
                    where: {
                        grade_name_academicYearId: {
                            grade,
                            name,
                            academicYearId: academicYear.id,
                        },
                    },
                    update: {},
                    create: {
                        grade,
                        name,
                        academicYearId: academicYear.id,
                    },
                });

                classes.push(c);
            }
        }

        //////////////////////////////////////////////////////
        // 4️⃣ ADMIN
        //////////////////////////////////////////////////////
        await tx.user.upsert({
            where: { username: "admin" },
            update: {},
            create: {
                username: "admin",
                password,
                role: Role.ADMIN,
            },
        });

        //////////////////////////////////////////////////////
        // 5️⃣ TEACHERS (UPSERT BY NRG)
        //////////////////////////////////////////////////////
        const teachers: string[] = [];

        for (let i = 1; i <= 10; i++) {
            const name = generateTeacherName();
            const nip = await generateIndonesianNip(tx);
            const email = generateTeacherEmail(name);
            const isPns = faker.datatype.boolean();

            // 🔒 Deterministic & Unique
            const nrg = 2000000000 + i;

            const teacher = await tx.teacher.upsert({
                where: { nrg },
                update: {},
                create: {
                    nrg,
                    nip,
                    nuptk: faker.string.numeric(18),
                    nrk: faker.string.numeric(8),

                    name,
                    gender: faker.helpers.arrayElement([
                        Gender.MALE,
                        Gender.FEMALE,
                    ]),

                    religionCode:
                    faker.helpers.arrayElement(religions).kode,

                    phone: generateIndonesianPhone(),
                    email,

                    educationLevel: EducationLevel.S1,
                    major: "Pendidikan",
                    graduationYear: 2015,

                    birthPlace: faker.location.city(),
                    birthDate: faker.date.birthdate({
                        min: 1975,
                        max: 1995,
                        mode: "year",
                    }),

                    civilServantRank: isPns
                        ? faker.helpers.arrayElement([
                            CivilServantRank.III_A,
                            CivilServantRank.III_B,
                            CivilServantRank.III_C,
                            CivilServantRank.IV_A,
                        ])
                        : null,

                    roles: generateTeacherRoles(),
                    isPns,
                },
            });

            await tx.user.upsert({
                where: { username: `guru${i}` },
                update: {},
                create: {
                    username: `guru${i}`,
                    password,
                    role: Role.TEACHER,
                    teacherId: teacher.id,
                },
            });

            teachers.push(teacher.id);
        }

        //////////////////////////////////////////////////////
        // 6️⃣ PARENTS
        //////////////////////////////////////////////////////
        const parents: { id: string; gender: "MALE" | "FEMALE" }[] = [];
        for (let i = 0; i < 10; i++) {
            const gender = faker.helpers.arrayElement(["MALE", "FEMALE"]);

            const email = faker.internet.email().toLowerCase();
            const phone = generateIndonesianPhone();

            const parent = await tx.parent.upsert({
                where: { phone }, // ✅ pakai field unique
                update: {},
                create: {
                    name:
                        gender === "MALE"
                            ? `Bpk. ${faker.person.fullName()}`
                            : `Ibu ${faker.person.fullName()}`,

                    email,
                    education: faker.helpers.arrayElement([
                        "SD",
                        "SMP",
                        "SMA",
                        "D3",
                        "S1",
                    ]),
                    job: faker.person.jobTitle(),
                    income: "5.000.000",
                    religionCode:
                    faker.helpers.arrayElement(religions).kode,
                    phone, // ✅ harus sama dengan where
                    address: faker.location.streetAddress(),
                },
            });

            parents.push({ id: parent.id, gender });
        }

        //////////////////////////////////////////////////////
        // 7️⃣ STUDENTS
        //////////////////////////////////////////////////////
        for (let i = 0; i < 50; i++) {
            const parent = parents[i % parents.length];
            const classId = faker.helpers.arrayElement(classes).id;

            // ✅ UNIQUE & SAFE
            const nis = 20240000 + i;     // unique
            const nisn = 900000000 + i;   // unique & < 2147483647

            const student = await tx.student.upsert({
                where: { nis }, // gunakan nis sebagai key upsert
                update: {},
                create: {
                    nis,
                    nisn,
                    name: faker.person.fullName(),
                    nickname: faker.person.firstName(),
                    gender: faker.helpers.arrayElement([
                        Gender.MALE,
                        Gender.FEMALE,
                    ]),
                    religionCode: faker.helpers.arrayElement(religions).kode,
                    rombelId: classId,
                    status: StudentStatus.ACTIVE,
                },
            });

            await tx.user.upsert({
                where: { username: String(nis) },
                update: {},
                create: {
                    username: String(nis),
                    password,
                    role: Role.STUDENT,
                    studentId: student.id,
                },
            });

            await tx.studentParent.upsert({
                where: {
                    studentId_role: {
                        studentId: student.id,
                        role:
                            parent.gender === "MALE"
                                ? ParentType.FATHER
                                : ParentType.MOTHER,
                    },
                },
                update: {},
                create: {
                    studentId: student.id,
                    parentId: parent.id,
                    role:
                        parent.gender === "MALE"
                            ? ParentType.FATHER
                            : ParentType.MOTHER,
                },
            });

        }

        //////////////////////////////////////////////////////
        // 8️⃣ VIOLATION MASTER
        //////////////////////////////////////////////////////
        for (const v of violationMaster) {
            await tx.violation.upsert({
                where: { name: v.name },
                update: {
                    point: v.point,
                    level: v.level,
                    deletedAt: null,
                },
                create: v,
            });
        }

        const violations = await tx.violation.findMany();

        if (violations.length > 0 && teachers.length > 0) {
            const sampleViolation = violations[0];
            const sampleTeacherId = teachers[0];

            // Ambil 1 student secara deterministic
            const sampleStudent = await tx.student.findFirst({
                orderBy: { createdAt: "asc" },
            });

            if (sampleStudent) {
                const occurredAt = new Date();

                const studentViolation = await tx.studentViolation.upsert({
                    where: {
                        studentId_violationId_occurredAt: {
                            studentId: sampleStudent.id,
                            violationId: sampleViolation.id,
                            occurredAt,
                        },
                    },
                    update: {},
                    create: {
                        studentId: sampleStudent.id,
                        violationId: sampleViolation.id,
                        point: sampleViolation.point,
                        occurredAt,
                    },
                });

                const resolution = await tx.violationResolution.upsert({
                    where: {
                        studentViolationId: studentViolation.id,
                    },
                    update: {},
                    create: {
                        studentViolationId: studentViolation.id,
                        handlerTeacherId: sampleTeacherId,
                        status: ViolationResolutionStatus.RESOLVED,
                        action: ViolationActionType.WARNING,
                        resolvedAt: new Date(),
                    },
                });

                await tx.violationActionLog.upsert({
                    where: {
                        resolutionId_action: {
                            resolutionId: resolution.id,
                            action: ViolationActionType.WARNING,
                        },
                    },
                    update: {},
                    create: {
                        resolutionId: resolution.id,
                        action: ViolationActionType.WARNING,
                    },
                });
            }
        }
    });

    console.log("✅ FULL SCHOOL DATABASE SEEDED SUCCESSFULLY");
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error("❌ SEED ERROR:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})();
