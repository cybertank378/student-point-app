import {
    Role,
    Gender,
    StudentStatus,
    ParentType,
    TeacherRole,
    ViolationLevel,
} from "@/generated/prisma";
import * as bcrypt from "bcryptjs";
import prisma from "@/libs/prisma";

async function main() {
    console.log("🌱 Start seeding...");

    //////////////////////////////////////////////////////
    // RELIGION
    //////////////////////////////////////////////////////
    const islam = await prisma.religion.upsert({
        where: { kode: "ISL" },
        update: {},
        create: { kode: "ISL", name: "Islam" },
    });

    //////////////////////////////////////////////////////
    // ACADEMIC YEAR
    //////////////////////////////////////////////////////
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

    //////////////////////////////////////////////////////
    // CLASSES (VII, VIII, IX)
    //////////////////////////////////////////////////////
    const grades = ["VII", "VIII", "IX"];
    const rombels = ["1", "2"];
    const classes: any[] = [];

    for (const grade of grades) {
        for (const name of rombels) {
            const kelas = await prisma.class.upsert({
                where: {
                    grade_name_academicYearId: {
                        grade,
                        name,
                        academicYearId: academicYear.id,
                    },
                },
                update: {},
                create: { grade, name, academicYearId: academicYear.id },
            });

            classes.push(kelas);
        }
    }

    //////////////////////////////////////////////////////
    // MASTER VIOLATION
    //////////////////////////////////////////////////////
    const violationSeed = [
        { name: "Terlambat", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak memakai atribut lengkap", point: 10, level: ViolationLevel.MEDIUM },
        { name: "Rambut tidak sesuai aturan", point: 15, level: ViolationLevel.MEDIUM },
        { name: "Membolos", point: 25, level: ViolationLevel.HEAVY },
        { name: "Merokok di sekolah", point: 50, level: ViolationLevel.HEAVY },
    ];

    const violations = [];

    for (const v of violationSeed) {
        const violation = await prisma.violation.upsert({
            where: { name: v.name },
            update: {},
            create: v,
        });

        violations.push(violation);
    }

    //////////////////////////////////////////////////////
    // HASH PASSWORD
    //////////////////////////////////////////////////////
    const defaultPassword = await bcrypt.hash("password123", 10);

    //////////////////////////////////////////////////////
    // GENERATE 30 STUDENTS + VIOLATIONS
    //////////////////////////////////////////////////////
    for (let i = 1; i <= 30; i++) {
        const selectedClass = classes[i % classes.length];
        const nis = 1000 + i;
        const nisn = 1234567800 + i;

        const student = await prisma.student.create({
            data: {
                nisn,
                nis,
                name: `Siswa ${i}`,
                gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
                religionId: islam.id,
                rombelId: selectedClass.id,
                status: StudentStatus.ACTIVE,
                profile: {
                    create: {
                        birthPlace: "Jakarta",
                        birthDate: new Date("2012-01-01"),
                        address: "Jl. Pendidikan No. 1",
                        distanceToSchool: "2 km",
                        transportToSchool: "Motor",
                        previousSchool: "SDN Jakarta",
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
        // STUDENT USER
        //////////////////////////////////////////////////////
        await prisma.user.create({
            data: {
                username: String(nis),
                password: defaultPassword,
                role: Role.STUDENT,
                studentId: student.id,
            },
        });

        //////////////////////////////////////////////////////
        // PARENT
        //////////////////////////////////////////////////////
        const parent = await prisma.parent.create({
            data: {
                studentId: student.id,
                type: ParentType.FATHER,
                name: `Orang Tua ${i}`,
                education: "SMA",
                job: "Karyawan",
                income: "5.000.000",
                religion: "Islam",
                phone: `0812345678${i}`,
                address: "Jl. Pendidikan No. 1",
            },
        });

        //////////////////////////////////////////////////////
        // PARENT USER
        //////////////////////////////////////////////////////
        await prisma.user.create({
            data: {
                username: `parent${nis}`,
                password: defaultPassword,
                role: Role.PARENT,
                parentId: parent.id,
            },
        });

        //////////////////////////////////////////////////////
        // RANDOM STUDENT VIOLATIONS
        //////////////////////////////////////////////////////
        const randomCount = Math.floor(Math.random() * 5);

        for (let j = 0; j < randomCount; j++) {
            const randomViolation =
                violations[Math.floor(Math.random() * violations.length)];

            await prisma.studentViolation.create({
                data: {
                    studentId: student.id,
                    violationId: randomViolation.id,
                    point: randomViolation.point,
                    occurredAt: new Date(),
                },
            });
        }
    }

    //////////////////////////////////////////////////////
    // TEACHER
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
            roles: [TeacherRole.HOMEROOM],
        },
    });

    //////////////////////////////////////////////////////
    // ADMIN
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
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
