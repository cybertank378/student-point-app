//Files: prisma/seed.ts

import { Role, Gender, StudentStatus, ParentType, TeacherRole } from "@/generated/prisma";
import * as bcrypt from "bcryptjs";
import prisma from "@/libs/prisma";


async function main() {
    console.log("🌱 Start seeding...");

    //////////////////////////////////////////////////////
    // 1️⃣ RELIGION (Master Data)
    //////////////////////////////////////////////////////
    const islam = await prisma.religion.upsert({
        where: { kode: "ISL" },
        update: {},
        create: {
            kode: "ISL",
            name: "Islam",
        },
    });

    //////////////////////////////////////////////////////
    // 2️⃣ ACADEMIC YEAR
    //////////////////////////////////////////////////////
    const academicYear = await prisma.academicYear.upsert({
        where: { name: "2024/2025" },
        update: {},
        create: {
            name: "2024/2025",
            isActive: true,
        },
    });

    //////////////////////////////////////////////////////
    // 3️⃣ CLASS
    //////////////////////////////////////////////////////
    const class7A = await prisma.class.upsert({
        where: {
            grade_name_academicYearId: {
                grade: "7",
                name: "A",
                academicYearId: academicYear.id,
            },
        },
        update: {},
        create: {
            grade: "7",
            name: "A",
            academicYearId: academicYear.id,
        },
    });

    //////////////////////////////////////////////////////
    // 4️⃣ HASH PASSWORD
    //////////////////////////////////////////////////////
    const defaultPassword = await bcrypt.hash("password123", 10);

    //////////////////////////////////////////////////////
    // 5️⃣ CREATE STUDENT
    //////////////////////////////////////////////////////
    const student = await prisma.student.create({
        data: {
            nisn: 1234567890,
            nis: 1001,
            name: "Ahmad Fauzan",
            gender: Gender.MALE,
            religionId: islam.id,
            rombelId: class7A.id,
            status: StudentStatus.ACTIVE,
            profile: {
                create: {
                    birthPlace: "Jakarta",
                    birthDate: new Date("2012-01-10"),
                    address: "Jl. Pendidikan No. 1",
                    distanceToSchool: "2 km",
                    transportToSchool: "Motor",
                    previousSchool: "SDN 01 Jakarta",
                    hasLaptop: true,
                    hasPC: false,
                    hasPhone: true,
                    kjpRecipient: false,
                    pipRecipient: false,
                    specialNeeds: false,
                    inclusion: false,
                },
            },
        },
    });

    //////////////////////////////////////////////////////
    // 6️⃣ CREATE PARENT
    //////////////////////////////////////////////////////
    const parent = await prisma.parent.create({
        data: {
            studentId: student.id,
            type: ParentType.FATHER,
            name: "Budi Santoso",
            education: "S1",
            job: "Karyawan Swasta",
            income: "5.000.000",
            religion: "Islam",
            phone: "081234567890",
            address: "Jl. Pendidikan No. 1",
        },
    });

    //////////////////////////////////////////////////////
    // 7️⃣ CREATE STUDENT USER
    //////////////////////////////////////////////////////
    await prisma.user.create({
        data: {
            username: "1001",
            password: defaultPassword,
            role: Role.STUDENT,
            studentId: student.id,
        },
    });

    //////////////////////////////////////////////////////
    // 8️⃣ CREATE PARENT USER
    //////////////////////////////////////////////////////
    await prisma.user.create({
        data: {
            username: "parent1001",
            password: defaultPassword,
            role: Role.PARENT,
            parentId: parent.id,
        },
    });

    //////////////////////////////////////////////////////
    // 9️⃣ CREATE TEACHER + USER
    //////////////////////////////////////////////////////
    const teacherUser = await prisma.user.create({
        data: {
            username: "1987654321",
            password: defaultPassword,
            role: Role.TEACHER,
        },
    });

    await prisma.teacher.create({
        data: {
            nip: "1987654321",
            name: "Siti Rahmawati",
            phone: "081298765432",
            email: "siti@school.com",
            userId: teacherUser.id,
            roles: [TeacherRole.HOMEROOM, TeacherRole.SUBJECT_TEACHER],
        },
    });

    //////////////////////////////////////////////////////
    // 🔟 CREATE ADMIN USER
    //////////////////////////////////////////////////////
    await prisma.user.create({
        data: {
            username: "admin",
            password: defaultPassword,
            role: Role.ADMIN,
        },
    });

    console.log("✅ Seeding finished successfully!");
}

main()
    .catch((error: unknown) => {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
