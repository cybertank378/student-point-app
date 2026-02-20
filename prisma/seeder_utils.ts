//Files: prisma/seeder_utils.ts

import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import {Prisma, ViolationLevel} from "@/generated/prisma";

faker.seed(123);

/* ================= PASSWORD ================= */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

/* ================= TEACHER NAME ================= */
export function generateTeacherName(): string {
    const firstNames = [
        "Ahmad","Muhammad","Budi","Dwi","Rizky","Fajar",
        "Siti","Dewi","Rina","Fitri","Ayu","Lestari",
        "Putra","Putri","Andi","Hendra","Yusuf","Indah"
    ];

    const lastNames = [
        "Santoso","Wijaya","Saputra","Pratama","Hidayat",
        "Setiawan","Permata","Maharani","Nugraha","Utami",
        "Ramadhan","Firmansyah","Wulandari","Kusuma"
    ];

    const titles = ["S.Pd.","M.Pd.","S.Si.","S.Pd.I"];

    return `${faker.helpers.arrayElement(firstNames)} ${faker.helpers.arrayElement(lastNames)}, ${faker.helpers.arrayElement(titles)}`;
}

/* ================= EMAIL ================= */
export function generateTeacherEmail(name: string): string {
    return name.split(",")[0].toLowerCase().replace(/\s+/g, ".") + "@sekolah.sch.id";
}

/* ================= PHONE ================= */
export function generateIndonesianPhone(): string {
    const prefixes = ["0812","0813","0821","0822","0856","0857","0858","0817","0818","0819","0896","0897","0898","0899"];
    return faker.helpers.arrayElement(prefixes) + faker.string.numeric(8);
}

/* ================= NIP ================= */
export async function generateIndonesianNip(
    tx: Prisma.TransactionClient
): Promise<string> {
    while (true) {
        const birth = faker.date.birthdate({ min: 25, max: 55, mode: "age" });

        const birthStr =
            birth.getFullYear().toString() +
            String(birth.getMonth() + 1).padStart(2, "0") +
            String(birth.getDate()).padStart(2, "0");

        const appointYear = birth.getFullYear() + faker.number.int({ min: 22, max: 30 });
        const appointMonth = faker.number.int({ min: 1, max: 12 });

        const appointStr =
            appointYear.toString() + String(appointMonth).padStart(2, "0");

        const sequence = faker.number.int({ min: 1, max: 999 }).toString().padStart(3, "0");

        const nip = birthStr + appointStr + sequence;

        const exists = await tx.teacher.findUnique({ where: { nip } });
        if (!exists) return nip;
    }
}


export const violationMaster = [
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
    { name: "Tindakan asusila di sekolah", point: 100, level: ViolationLevel.HEAVY },
];