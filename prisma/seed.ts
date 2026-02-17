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
import bcrypt from "bcryptjs";
import prisma from "@/libs/prisma";

faker.seed(123);

async function main() {
    console.log("🌱 FULL DATABASE SEED START...");

    const password = await bcrypt.hash("password123", 10);

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
    // CLASS
    //////////////////////////////////////////////////////
    const classes = [];
    for (const grade of ["VII", "VIII", "IX"]) {
        for (const name of ["1", "2"]) {
            const c = await prisma.class.upsert({
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

// =========================
        // LIGHT (1 - 40)
        // =========================
        { name: "Datang terlambat ≤ 10 menit", point: 5, level: ViolationLevel.LIGHT },
        { name: "Seragam tidak rapi", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak memakai dasi", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak memakai atribut lengkap", point: 5, level: ViolationLevel.LIGHT },
        { name: "Sepatu tidak sesuai ketentuan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak memakai kaos kaki sesuai aturan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Rambut tidak rapi", point: 5, level: ViolationLevel.LIGHT },
        { name: "Kuku panjang", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak membawa buku pelajaran", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak membawa alat tulis", point: 5, level: ViolationLevel.LIGHT },
        { name: "Berisik saat pelajaran", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidur saat pelajaran", point: 5, level: ViolationLevel.LIGHT },
        { name: "Makan di kelas", point: 5, level: ViolationLevel.LIGHT },
        { name: "Minum saat pelajaran tanpa izin", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak piket kelas", point: 5, level: ViolationLevel.LIGHT },
        { name: "Membuang sampah sembarangan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak mengikuti upacara dengan tertib", point: 5, level: ViolationLevel.LIGHT },
        { name: "Keluar kelas tanpa izin", point: 10, level: ViolationLevel.LIGHT },
        { name: "Tidak mengerjakan PR", point: 10, level: ViolationLevel.LIGHT },
        { name: "Tidak membawa kartu pelajar", point: 5, level: ViolationLevel.LIGHT },
        { name: "Datang terlambat > 10 menit", point: 10, level: ViolationLevel.LIGHT },
        { name: "Tidak memakai ikat pinggang", point: 5, level: ViolationLevel.LIGHT },
        { name: "Bercanda berlebihan di kelas", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak mengikuti doa bersama", point: 5, level: ViolationLevel.LIGHT },
        { name: "Mengganggu teman belajar", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak menyimpan HP sesuai aturan", point: 10, level: ViolationLevel.LIGHT },
        { name: "Duduk tidak sesuai tempat", point: 5, level: ViolationLevel.LIGHT },
        { name: "Meninggalkan kelas saat pergantian jam", point: 10, level: ViolationLevel.LIGHT },
        { name: "Berpakaian olahraga tidak sesuai jadwal", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak mengikuti senam pagi", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak membawa perlengkapan praktik", point: 10, level: ViolationLevel.LIGHT },
        { name: "Berbicara kasar ringan", point: 10, level: ViolationLevel.LIGHT },
        { name: "Membawa mainan ke sekolah", point: 5, level: ViolationLevel.LIGHT },
        { name: "Memakai aksesoris berlebihan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Terlambat masuk setelah istirahat", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak mengikuti apel kelas", point: 5, level: ViolationLevel.LIGHT },
        { name: "Menyontek ringan", point: 10, level: ViolationLevel.LIGHT },
        { name: "Mencoret meja", point: 10, level: ViolationLevel.LIGHT },
        { name: "Tidak memakai masker saat diwajibkan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Menggunakan HP tanpa izin", point: 10, level: ViolationLevel.LIGHT },

        // =========================
        // MEDIUM (41 - 90)
        // =========================
        { name: "Membolos 1 jam pelajaran", point: 20, level: ViolationLevel.MEDIUM },
        { name: "Membolos 1 hari", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Berbohong kepada guru", point: 20, level: ViolationLevel.MEDIUM },
        { name: "Melawan guru secara verbal", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Merokok di lingkungan sekolah", point: 40, level: ViolationLevel.MEDIUM },
        { name: "Membawa rokok", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Berpacaran berlebihan di sekolah", point: 20, level: ViolationLevel.MEDIUM },
        { name: "Berkelahi ringan", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Mengancam teman", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Merusak fasilitas ringan", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Menyontek saat ujian", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Plagiarisme tugas", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Menyebarkan gosip merugikan", point: 20, level: ViolationLevel.MEDIUM },
        { name: "Mengakses konten terlarang", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Mengunggah konten sekolah tanpa izin", point: 20, level: ViolationLevel.MEDIUM },
        { name: "Tidak hadir tanpa keterangan 2 hari", point: 40, level: ViolationLevel.MEDIUM },
        { name: "Membawa senjata tajam mainan", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Menyalahgunakan media sosial", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Memalsukan tanda tangan", point: 40, level: ViolationLevel.MEDIUM },
        { name: "Mengintimidasi teman", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Membawa petasan", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Kabur saat jam pelajaran", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Vandalisme ringan", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Mengganggu kegiatan sekolah", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Membawa kartu remi", point: 20, level: ViolationLevel.MEDIUM },
        { name: "Mengajak teman membolos", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Menggunakan identitas palsu", point: 40, level: ViolationLevel.MEDIUM },
        { name: "Mengancam melalui pesan", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Menyebarkan hoaks", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Berkata tidak sopan berat", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Menyembunyikan barang teman", point: 20, level: ViolationLevel.MEDIUM },
        { name: "Menolak tugas sekolah", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Merusak properti teman", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Membuat keributan besar", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Membawa minuman keras", point: 40, level: ViolationLevel.MEDIUM },
        { name: "Menyebarkan foto tanpa izin", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Mengakses WiFi ilegal", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Menolak pemeriksaan", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Menghasut perkelahian", point: 40, level: ViolationLevel.MEDIUM },
        { name: "Tidak hadir tanpa keterangan 3 hari", point: 40, level: ViolationLevel.MEDIUM },

        // =========================
        // HEAVY (91 - 120)
        // =========================
        { name: "Bullying berat", point: 75, level: ViolationLevel.HEAVY },
        { name: "Berkelahi berat", point: 80, level: ViolationLevel.HEAVY },
        { name: "Membawa senjata tajam", point: 100, level: ViolationLevel.HEAVY },
        { name: "Mengonsumsi narkoba", point: 100, level: ViolationLevel.HEAVY },
        { name: "Mengedarkan narkoba", point: 100, level: ViolationLevel.HEAVY },
        { name: "Pencurian berat", point: 90, level: ViolationLevel.HEAVY },
        { name: "Pemerasan", point: 85, level: ViolationLevel.HEAVY },
        { name: "Pelecehan seksual", point: 100, level: ViolationLevel.HEAVY },
        { name: "Tawuran antar sekolah", point: 95, level: ViolationLevel.HEAVY },
        { name: "Merusak fasilitas berat", point: 80, level: ViolationLevel.HEAVY },
        { name: "Mengancam guru", point: 90, level: ViolationLevel.HEAVY },
        { name: "Menghasut kerusuhan", point: 85, level: ViolationLevel.HEAVY },
        { name: "Pemalsuan dokumen resmi", point: 95, level: ViolationLevel.HEAVY },
        { name: "Penyebaran konten asusila", point: 100, level: ViolationLevel.HEAVY },
        { name: "Kekerasan terhadap guru", point: 100, level: ViolationLevel.HEAVY },
        { name: "Kekerasan terhadap siswa", point: 85, level: ViolationLevel.HEAVY },
        { name: "Perusakan kendaraan guru", point: 80, level: ViolationLevel.HEAVY },
        { name: "Pencurian uang sekolah", point: 90, level: ViolationLevel.HEAVY },
        { name: "Membawa bahan peledak", point: 100, level: ViolationLevel.HEAVY },
        { name: "Tindak kriminal di sekolah", point: 100, level: ViolationLevel.HEAVY },
        { name: "Perjudian di sekolah", point: 80, level: ViolationLevel.HEAVY },
        { name: "Menyebarkan ancaman bom", point: 100, level: ViolationLevel.HEAVY },
        { name: "Pemukulan berencana", point: 95, level: ViolationLevel.HEAVY },
        { name: "Membakar fasilitas sekolah", point: 100, level: ViolationLevel.HEAVY },
        { name: "Penyalahgunaan data sekolah", point: 85, level: ViolationLevel.HEAVY },
        { name: "Peretasan sistem sekolah", point: 95, level: ViolationLevel.HEAVY },
        { name: "Pencemaran nama baik sekolah", point: 80, level: ViolationLevel.HEAVY },
        { name: "Mengajak tindakan kriminal", point: 90, level: ViolationLevel.HEAVY },
        { name: "Menyelundupkan barang terlarang", point: 90, level: ViolationLevel.HEAVY },
        { name: "Tindakan asusila di sekolah", point: 100, level: ViolationLevel.HEAVY }

    ];

    await prisma.violation.createMany({
        data: violationMaster,
        skipDuplicates: true,
    });

    const allViolations = await prisma.violation.findMany();

    //////////////////////////////////////////////////////
    // ACHIEVEMENT MASTER
    //////////////////////////////////////////////////////
    const achievementMaster = [
        { name: "Juara 1 Lomba", point: 50 },
        { name: "Ketua OSIS", point: 40 },
        { name: "Juara Kelas", point: 30 },
    ];

    await prisma.achievement.createMany({
        data: achievementMaster,
        skipDuplicates: true,
    });

    const achievements = await prisma.achievement.findMany();

    //////////////////////////////////////////////////////
    // TEACHER
    //////////////////////////////////////////////////////
    const teacherUser = await prisma.user.upsert({
        where: { username: "1987654321" },
        update: {},
        create: {
            username: "1987654321",
            password,
            role: Role.TEACHER,
        },
    });

    const teacher = await prisma.teacher.upsert({
        where: { nip: "1987654321" },
        update: {},
        create: {
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
    await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password,
            role: Role.ADMIN,
        },
    });

    //////////////////////////////////////////////////////
    // STUDENTS & FAMILIES
    //////////////////////////////////////////////////////
    let index = 1;

    for (let family = 1; family <= 5; family++) {
        const father = await prisma.parent.create({
            data: {
                name: `Budi Santoso ${family}`,
                education: "SMA",
                job: "Wiraswasta",
                income: "5.000.000",
                religion: "Islam",
                phone: `0812300${family}`,
                address: `Jl. Pendidikan No ${family}, Jakarta`,
            },
        });

        const mother = await prisma.parent.create({
            data: {
                name: `Siti Aminah ${family}`,
                education: "SMA",
                job: "Ibu Rumah Tangga",
                income: "3.000.000",
                religion: "Islam",
                phone: `0821300${family}`,
                address: father.address,
            },
        });

        for (let i = 0; i < 2; i++) {
            const nis = 1000 + index;

            const student = await prisma.student.create({
                data: {
                    nis,
                    nisn: 1234567800 + index,
                    name: `Ahmad Pratama ${index}`,
                    gender: index % 2 === 0 ? Gender.MALE : Gender.FEMALE,
                    religionId: islam.id,
                    rombelId: classes[index % classes.length].id,
                    status: StudentStatus.ACTIVE,
                },
            });

            await prisma.user.create({
                data: {
                    username: String(nis),
                    password,
                    role: Role.STUDENT,
                    studentId: student.id,
                },
            });

            // RELASI KE FATHER
            await prisma.studentParent.create({
                data: {
                    studentId: student.id,
                    parentId: father.id,
                    role: ParentType.FATHER,
                },
            });

            // RELASI KE MOTHER
            await prisma.studentParent.create({
                data: {
                    studentId: student.id,
                    parentId: mother.id,
                    role: ParentType.MOTHER,
                },
            });

            // RANDOM VIOLATION
            const randomViolation =
                allViolations[Math.floor(Math.random() * allViolations.length)];

            const studentViolation = await prisma.studentViolation.create({
                data: {
                    studentId: student.id,
                    violationId: randomViolation.id,
                    point: randomViolation.point,
                    occurredAt: new Date(),
                },
            });

            const resolution = await prisma.violationResolution.create({
                data: {
                    studentViolationId: studentViolation.id,
                    handlerTeacherId: teacher.id,
                    status: ViolationResolutionStatus.RESOLVED,
                    action: ViolationActionType.WARNING,
                    note: "Sudah dinasihati",
                    resolvedAt: new Date(),
                },
            });

            await prisma.violationActionLog.create({
                data: {
                    resolutionId: resolution.id,
                    action: ViolationActionType.WARNING,
                    note: "Peringatan lisan diberikan",
                },
            });

            // RANDOM ACHIEVEMENT
            const achievement =
                achievements[Math.floor(Math.random() * achievements.length)];

            await prisma.studentAchievement.create({
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

    console.log("✅ FULL DATABASE SEEDED SUCCESSFULLY");
}

main()
    .catch((e) => {
        console.error("❌ SEED ERROR:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
