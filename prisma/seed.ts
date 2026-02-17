import {
    Role,
    Gender,
    StudentStatus,
    ParentType,
    TeacherRole,
    ViolationLevel,
    ViolationResolutionStatus,
    ViolationActionType,
} from "@/generated/prisma";

import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";
import prisma from "@/libs/prisma";

faker.seed(123); // deterministic

async function main() {
    console.log("🌱 FULL DATABASE SEED START...");

    const password = await bcrypt.hash("password123", 10);

    await prisma.$transaction(async (tx) => {

        //////////////////////////////////////////////////////
        // RELIGION
        //////////////////////////////////////////////////////
        const islam = await tx.religion.upsert({
            where: { kode: "ISL" },
            update: {},
            create: { kode: "ISL", name: "Islam" },
        });

        //////////////////////////////////////////////////////
        // ACADEMIC YEAR
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
        // CLASS
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
        // VIOLATION MASTER
        //////////////////////////////////////////////////////

        const violationMaster = [
            // ================= LIGHT (40) =================
            { name: "Datang terlambat ≤ 10 menit", point: 5, level: ViolationLevel.LIGHT },
            { name: "Seragam tidak rapi", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak memakai dasi", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak memakai topi saat upacara", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak memakai kaos kaki sesuai aturan", point: 5, level: ViolationLevel.LIGHT },
            { name: "Sepatu tidak sesuai ketentuan", point: 5, level: ViolationLevel.LIGHT },
            { name: "Rambut tidak sesuai aturan", point: 5, level: ViolationLevel.LIGHT },
            { name: "Kuku panjang", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak membawa buku pelajaran", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak membawa kartu pelajar", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak piket sesuai jadwal", point: 10, level: ViolationLevel.LIGHT },
            { name: "Makan di kelas", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidur di kelas", point: 10, level: ViolationLevel.LIGHT },
            { name: "Berbicara saat guru menjelaskan", point: 5, level: ViolationLevel.LIGHT },
            { name: "Bercanda berlebihan", point: 5, level: ViolationLevel.LIGHT },
            { name: "Membuang sampah sembarangan", point: 5, level: ViolationLevel.LIGHT },
            { name: "Datang tanpa atribut lengkap", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak mengikuti doa pagi", point: 5, level: ViolationLevel.LIGHT },
            { name: "Duduk tidak sopan", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak membawa alat tulis", point: 5, level: ViolationLevel.LIGHT },
            { name: "Keluar kelas tanpa izin ≤ 5 menit", point: 10, level: ViolationLevel.LIGHT },
            { name: "Terlambat masuk setelah istirahat", point: 5, level: ViolationLevel.LIGHT },
            { name: "Menggunakan aksesoris berlebihan", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak mengerjakan PR (1x)", point: 10, level: ViolationLevel.LIGHT },
            { name: "Seragam olahraga tidak sesuai jadwal", point: 5, level: ViolationLevel.LIGHT },
            { name: "Mengobrol saat upacara", point: 5, level: ViolationLevel.LIGHT },
            { name: "Masuk kelas tidak sesuai jadwal", point: 5, level: ViolationLevel.LIGHT },
            { name: "Terlambat masuk sekolah > 10 menit", point: 10, level: ViolationLevel.LIGHT },
            { name: "Tidak membawa buku agenda", point: 5, level: ViolationLevel.LIGHT },
            { name: "Menggunakan sandal di kelas", point: 5, level: ViolationLevel.LIGHT },
            { name: "Menyontek pekerjaan rumah", point: 10, level: ViolationLevel.LIGHT },
            { name: "Menggambar di meja", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak mengikuti apel pagi", point: 10, level: ViolationLevel.LIGHT },
            { name: "Berbaris tidak tertib", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak memakai name tag", point: 5, level: ViolationLevel.LIGHT },
            { name: "Mengganggu teman belajar", point: 5, level: ViolationLevel.LIGHT },
            { name: "Masuk kelas tanpa salam", point: 5, level: ViolationLevel.LIGHT },
            { name: "Tidak menjaga kebersihan kelas", point: 10, level: ViolationLevel.LIGHT },
            { name: "Berisik di perpustakaan", point: 5, level: ViolationLevel.LIGHT },
            { name: "Menggunakan HP saat pelajaran (peringatan pertama)", point: 10, level: ViolationLevel.LIGHT },

            // ================= MEDIUM (40) =================
            { name: "Membolos 1 jam pelajaran", point: 20, level: ViolationLevel.MEDIUM },
            { name: "Tidak hadir tanpa keterangan", point: 20, level: ViolationLevel.MEDIUM },
            { name: "Menggunakan HP tanpa izin", point: 25, level: ViolationLevel.MEDIUM },
            { name: "Menyontek saat ujian", point: 30, level: ViolationLevel.MEDIUM },
            { name: "Mengajak teman membolos", point: 30, level: ViolationLevel.MEDIUM },
            { name: "Menggunakan bahasa kasar", point: 25, level: ViolationLevel.MEDIUM },
            { name: "Mengolok-olok teman", point: 25, level: ViolationLevel.MEDIUM },
            { name: "Merusak fasilitas ringan", point: 30, level: ViolationLevel.MEDIUM },
            { name: "Bertengkar ringan", point: 30, level: ViolationLevel.MEDIUM },
            { name: "Keluar sekolah tanpa izin", point: 35, level: ViolationLevel.MEDIUM },
            // ... (lanjutkan sampai 40 medium)

            // ================= HEAVY (40) =================
            { name: "Berkelahi hingga luka", point: 50, level: ViolationLevel.HEAVY },
            { name: "Bullying berat", point: 75, level: ViolationLevel.HEAVY },
            { name: "Perundungan sistematis", point: 100, level: ViolationLevel.HEAVY },
            { name: "Membawa senjata tajam", point: 100, level: ViolationLevel.HEAVY },
            { name: "Penyalahgunaan narkoba", point: 100, level: ViolationLevel.HEAVY },
            // ... (lanjutkan sampai 40 heavy)
        ];

        const violations = await Promise.all(
            violationMaster.map((v) =>
                tx.violation.upsert({
                    where: { name: v.name },
                    update: {},
                    create: v,
                })
            )
        );


        //////////////////////////////////////////////////////
        // ACHIEVEMENT MASTER
        //////////////////////////////////////////////////////
        const achievements = await Promise.all(
            [
                { name: "Juara 1 Lomba", point: 50 },
                { name: "Ketua OSIS", point: 40 },
                { name: "Juara Kelas", point: 30 },
            ].map((a) =>
                tx.achievement.create({
                    data: a,
                })
            )
        );

        //////////////////////////////////////////////////////
        // TEACHERS
        //////////////////////////////////////////////////////
        const teacherUser = await tx.user.create({
            data: {
                username: "1987654321",
                password,
                role: Role.TEACHER,
            },
        });

        const teacher = await tx.teacher.create({
            data: {
                nip: "1987654321",
                name: "Siti Rahmawati",
                phone: "081234567890",
                email: "guru@sekolah.sch.id",
                userId: teacherUser.id,
                roles: [TeacherRole.HOMEROOM],
            },
        });

        //////////////////////////////////////////////////////
        // ADMIN
        //////////////////////////////////////////////////////
        await tx.user.create({
            data: {
                username: "admin",
                password,
                role: Role.ADMIN,
            },
        });

        //////////////////////////////////////////////////////
        // 30 STUDENTS (15 FAMILIES)
        //////////////////////////////////////////////////////
        let index = 1;

        for (let family = 1; family <= 15; family++) {

            // ===== Parents =====
            const father = await tx.parent.create({
                data: {
                    name: `Budi Santoso ${family}`,
                    education: "SMA",
                    job: "Wiraswasta",
                    income: "5.000.000",
                    religion: "Islam",
                    phone: `08123${faker.string.numeric(6)}`,
                    address: `Jl. Pendidikan No ${family}, Jakarta`,
                },
            });

            const mother = await tx.parent.create({
                data: {
                    name: `Siti Aminah ${family}`,
                    education: "SMA",
                    job: "Ibu Rumah Tangga",
                    income: "3.000.000",
                    religion: "Islam",
                    phone: `08213${faker.string.numeric(6)}`,
                    address: father.address,
                },
            });

            await tx.user.create({
                data: {
                    username: `father_${family}`,
                    password,
                    role: Role.PARENT,
                    parentId: father.id,
                },
            });

            await tx.user.create({
                data: {
                    username: `mother_${family}`,
                    password,
                    role: Role.PARENT,
                    parentId: mother.id,
                },
            });

            // ===== 2 Children per family =====
            for (let i = 0; i < 2; i++) {

                const nis = 1000 + index;
                const nisn = 1234567800 + index;

                const student = await tx.student.create({
                    data: {
                        nis,
                        nisn,
                        name: `Ahmad Pratama ${index}`,
                        gender: index % 2 === 0 ? Gender.MALE : Gender.FEMALE,
                        religionId: islam.id,
                        rombelId: classes[index % classes.length].id,
                        status: StudentStatus.ACTIVE,
                        profile: {
                            create: {
                                birthPlace: "Jakarta",
                                birthDate: new Date("2012-01-01"),
                                address: father.address,
                                distanceToSchool: "3 km",
                                transportToSchool: "Motor",
                                previousSchool: "SD Negeri 01 Jakarta",
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

                await tx.user.create({
                    data: {
                        username: String(nis),
                        password,
                        role: Role.STUDENT,
                        studentId: student.id,
                    },
                });

                // ===== Pivot =====
                await tx.studentParent.createMany({
                    data: [
                        { studentId: student.id, parentId: father.id, role: ParentType.FATHER },
                        { studentId: student.id, parentId: mother.id, role: ParentType.MOTHER },
                    ],
                });

                // ===== Violation =====
                const violation = violations[index % violations.length];

                const studentViolation = await tx.studentViolation.create({
                    data: {
                        studentId: student.id,
                        violationId: violation.id,
                        point: violation.point,
                        occurredAt: new Date(),
                    },
                });

                // ===== Resolution =====
                const resolution = await tx.violationResolution.create({
                    data: {
                        studentViolationId: studentViolation.id,
                        handlerTeacherId: teacher.id,
                        status: ViolationResolutionStatus.RESOLVED,
                        action: ViolationActionType.WARNING,
                        note: "Sudah dinasihati",
                        resolvedAt: new Date(),
                    },
                });

                await tx.violationActionLog.create({
                    data: {
                        resolutionId: resolution.id,
                        action: ViolationActionType.WARNING,
                        note: "Peringatan lisan diberikan",
                    },
                });

                // ===== Achievement =====
                const achievement = achievements[index % achievements.length];

                await tx.studentAchievement.create({
                    data: {
                        studentId: student.id,
                        achievementId: achievement.id,
                        point: achievement.point,
                        achievedAt: new Date(),
                    },
                });

                index++;
            }
        }

        //////////////////////////////////////////////////////
        // AUTH SESSION + RESET TOKEN + LOGIN AUDIT
        //////////////////////////////////////////////////////
        const someUser = await tx.user.findFirst({
            where: { role: Role.STUDENT },
        });

        if (someUser) {
            await tx.authSession.create({
                data: {
                    userId: someUser.id,
                    tokenHash: faker.string.uuid(),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    device: "Chrome",
                    ip: "127.0.0.1",
                },
            });

            await tx.passwordResetToken.create({
                data: {
                    userId: someUser.id,
                    tokenHash: faker.string.uuid(),
                    expiresAt: new Date(Date.now() + 3600000),
                },
            });

            await tx.loginAudit.create({
                data: {
                    userId: someUser.id,
                    identifier: someUser.username,
                    success: true,
                    ip: "127.0.0.1",
                    userAgent: "Mozilla",
                },
            });
        }

    });

    console.log("✅ FULL DATABASE SEEDED SUCCESSFULLY");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
