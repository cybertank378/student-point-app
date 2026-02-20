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

/* ============================================================
   1️⃣ RELIGIONS
============================================================ */
async function seedReligions() {
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

    console.log("✅ Religions Seeded");
}

/* ============================================================
   2️⃣ ACADEMIC YEAR
============================================================ */
async function seedAcademicYear() {
    console.log("🔹 Seeding Academic Year...");

    const academicYear = await prisma.academicYear.upsert({
        where: { name: "2024/2025" },
        update: {},
        create: {
            name: "2024/2025",
            startDate: new Date("2024-07-01"),
            endDate: new Date("2025-06-30"),
            isActive: true,
        },
    });

    console.log("✅ Academic Year Seeded");
    return academicYear;
}

/* ============================================================
   3️⃣ CLASSES
============================================================ */
async function seedClasses(academicYearId: string) {
    console.log("🔹 Seeding Classes...");

    const classes = [];

    for (const grade of ["VII", "VIII", "IX"]) {
        for (const name of ["1", "2"]) {
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

    console.log("✅ Classes Seeded");
    return classes;
}

/* ============================================================
   4️⃣ ADMIN
============================================================ */
async function seedAdmin(password: string) {
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

    console.log("✅ Admin Seeded");
}

/* ============================================================
   5️⃣ TEACHERS
============================================================ */
function generateTeacherRoles(): TeacherRole[] {
    return [
        TeacherRole.SUBJECT_TEACHER,
        ...(faker.datatype.boolean() ? [TeacherRole.DUTY_TEACHER] : []),
    ];
}

async function seedTeachers(password: string) {
    console.log("🔹 Seeding Teachers...");

    const religions = await prisma.religion.findMany({
        select: { kode: true },
    });

    const teachers: string[] = [];

    for (let i = 1; i <= 10; i++) {
        const name = generateTeacherName();
        const nip = await generateIndonesianNip(prisma);
        const email = generateTeacherEmail(name);

        const teacher = await prisma.teacher.create({
            data: {
                nrg: 2000000000 + i,
                nip,
                nuptk: faker.string.numeric(18),
                nrk: faker.string.numeric(8),
                name,
                gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
                religionCode: faker.helpers.arrayElement(religions).kode,
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
                civilServantRank: faker.helpers.arrayElement([
                    CivilServantRank.III_A,
                    CivilServantRank.III_B,
                ]),
                roles: generateTeacherRoles(),
                isPns: true,
            },
        });

        await prisma.user.create({
            data: {
                username: `guru${i}`,
                password,
                role: Role.TEACHER,
                teacherId: teacher.id,
            },
        });

        teachers.push(teacher.id);
    }

    console.log("✅ Teachers Seeded");
    return teachers;
}

/* ============================================================
   6️⃣ PARENTS
============================================================ */
async function seedParents() {
    console.log("🔹 Seeding Parents...");

    const religions = await prisma.religion.findMany({
        select: { kode: true },
    });

    const parents = [];

    for (let i = 0; i < 10; i++) {
        const parent = await prisma.parent.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                education: "S1",
                job: faker.person.jobTitle(),
                income: "5.000.000",
                religionCode: faker.helpers.arrayElement(religions).kode,
                phone: generateIndonesianPhone(),
                address: faker.location.streetAddress(),
            },
        });

        parents.push(parent);
    }

    console.log("✅ Parents Seeded");
    return parents;
}

/* ============================================================
   7️⃣ STUDENTS
============================================================ */
async function seedStudents(password: string, classes: any[], parents: any[]) {
    console.log("🔹 Seeding Students...");

    const religions = await prisma.religion.findMany({
        select: { kode: true },
    });

    for (let i = 0; i < 50; i++) {
        const student = await prisma.student.create({
            data: {
                nis: 20240000 + i,
                nisn: 900000000 + i,
                name: faker.person.fullName(),
                nickname: faker.person.firstName(),
                gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
                religionCode: faker.helpers.arrayElement(religions).kode,
                rombelId: faker.helpers.arrayElement(classes).id,
                status: StudentStatus.ACTIVE,
            },
        });

        await prisma.user.create({
            data: {
                username: String(student.nis),
                password,
                role: Role.STUDENT,
                studentId: student.id,
            },
        });

        await prisma.studentParent.create({
            data: {
                studentId: student.id,
                parentId: faker.helpers.arrayElement(parents).id,
                role: ParentType.FATHER,
            },
        });
    }

    console.log("✅ Students Seeded");
}

/* ============================================================
   8️⃣ VIOLATION MASTER
============================================================ */
async function seedViolations() {
    console.log("🔹 Seeding Violation Master...");

    await prisma.violation.createMany({
        data: violationMaster,
        skipDuplicates: true,
    });

    console.log("✅ Violation Master Seeded");
}

/* ============================================================
   9️⃣ SAMPLE VIOLATION CASE
============================================================ */
async function seedSampleViolationCase() {
    console.log("🔹 Seeding Sample Violation Resolution...");

    const student = await prisma.student.findFirst();
    const violation = await prisma.violation.findFirst();
    const teacher = await prisma.teacher.findFirst();

    if (!student || !violation || !teacher) {
        console.log("⚠ Skipped Sample Case (missing data)");
        return;
    }

    const occurredAt = new Date("2024-08-01T08:00:00Z");

    const studentViolation = await prisma.studentViolation.upsert({
        where: {
            studentId_violationId_occurredAt: {
                studentId: student.id,
                violationId: violation.id,
                occurredAt,
            },
        },
        update: {},
        create: {
            studentId: student.id,
            violationId: violation.id,
            point: violation.point,
            occurredAt,
        },
    });

    const resolution = await prisma.violationResolution.upsert({
        where: { studentViolationId: studentViolation.id },
        update: {},
        create: {
            studentViolationId: studentViolation.id,
            handlerTeacherId: teacher.id,
            status: ViolationResolutionStatus.RESOLVED,
            action: ViolationActionType.WARNING,
            resolvedAt: new Date("2024-08-02T09:00:00Z"),
        },
    });

    await prisma.violationActionLog.upsert({
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

    console.log("✅ Sample Violation Resolution Seeded");
}

/* ============================================================
   MAIN
============================================================ */
async function main() {
    console.log("🌱 FULL SCHOOL DATABASE SEED START");

    const password = await hashPassword("password123");

    await seedReligions();
    const academicYear = await seedAcademicYear();
    const classes = await seedClasses(academicYear.id);
    await seedAdmin(password);
    await seedTeachers(password);
    const parents = await seedParents();
    await seedStudents(password, classes, parents);
    await seedViolations();
    await seedSampleViolationCase();

    console.log("🎉 FULL SCHOOL DATABASE SEEDED SUCCESSFULLY");
}

main()
    .catch((e) => {
        console.error("❌ SEED ERROR:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });