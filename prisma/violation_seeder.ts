
import {
    ViolationLevel,
} from "@/generated/prisma";

import prisma from "@/libs/prisma";

async function seedViolations() {
    const violations = [

        // ==============================
        // LIGHT (25)
        // ==============================
        { name: "Datang terlambat ≤ 15 menit", point: 5, level: ViolationLevel.LIGHT },
        { name: "Datang terlambat > 15 menit", point: 10, level: ViolationLevel.LIGHT },
        { name: "Tidak memakai atribut lengkap", point: 5, level: ViolationLevel.LIGHT },
        { name: "Rambut tidak sesuai aturan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Kuku panjang / tidak rapi", point: 5, level: ViolationLevel.LIGHT },
        { name: "Sepatu tidak sesuai aturan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak membawa buku pelajaran", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak membawa kartu pelajar", point: 5, level: ViolationLevel.LIGHT },
        { name: "Seragam tidak rapi", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak piket sesuai jadwal", point: 10, level: ViolationLevel.LIGHT },
        { name: "Makan di kelas", point: 5, level: ViolationLevel.LIGHT },
        { name: "Berbicara saat guru menjelaskan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidur di kelas", point: 10, level: ViolationLevel.LIGHT },
        { name: "Bercanda berlebihan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Membuang sampah sembarangan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak mengikuti upacara", point: 10, level: ViolationLevel.LIGHT },
        { name: "Keluar kelas tanpa izin", point: 10, level: ViolationLevel.LIGHT },
        { name: "Duduk tidak sopan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak mengerjakan PR", point: 10, level: ViolationLevel.LIGHT },
        { name: "Menggunakan aksesoris berlebihan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Terlambat masuk setelah istirahat", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak membawa topi saat upacara", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak memakai dasi", point: 5, level: ViolationLevel.LIGHT },
        { name: "Tidak memakai kaos kaki sesuai aturan", point: 5, level: ViolationLevel.LIGHT },
        { name: "Masuk kelas tidak sesuai jadwal", point: 5, level: ViolationLevel.LIGHT },

        // ==============================
        // MEDIUM (30)
        // ==============================
        { name: "Membolos 1 jam pelajaran", point: 20, level: ViolationLevel.MEDIUM },
        { name: "Tidak hadir tanpa keterangan", point: 20, level: ViolationLevel.MEDIUM },
        { name: "Membawa HP tanpa izin", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Menyontek saat ujian", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Mengajak teman membolos", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Menggunakan bahasa kasar", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Mengolok-olok teman", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Merusak fasilitas ringan", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Bertengkar ringan", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Mengganggu kelas lain", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Keluar sekolah tanpa izin", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Mengancam teman", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Mengakses konten terlarang", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Menyebarkan hoax di sekolah", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Mencorat-coret dinding", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Membuat kegaduhan berat", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Menggunakan akun palsu", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Menolak perintah guru", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Berbohong kepada guru", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Mengintimidasi teman", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Mengambil barang tanpa izin", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Menyebarkan foto teman tanpa izin", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Masuk ruang guru tanpa izin", point: 25, level: ViolationLevel.MEDIUM },
        { name: "Merokok di lingkungan sekolah", point: 40, level: ViolationLevel.MEDIUM },
        { name: "Mengubah nilai tanpa izin", point: 40, level: ViolationLevel.MEDIUM },
        { name: "Menyembunyikan barang teman", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Mengganggu kegiatan ibadah sekolah", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Menyalahgunakan media sosial sekolah", point: 35, level: ViolationLevel.MEDIUM },
        { name: "Menyebarkan gosip merugikan", point: 30, level: ViolationLevel.MEDIUM },
        { name: "Menyalakan petasan di sekolah", point: 35, level: ViolationLevel.MEDIUM },

        // ==============================
        // HEAVY (25)
        // ==============================
        { name: "Berkelahi hingga luka", point: 50, level: ViolationLevel.HEAVY },
        { name: "Bullying berat", point: 75, level: ViolationLevel.HEAVY },
        { name: "Perundungan sistematis", point: 100, level: ViolationLevel.HEAVY },
        { name: "Membawa rokok/vape", point: 50, level: ViolationLevel.HEAVY },
        { name: "Membawa minuman keras", point: 75, level: ViolationLevel.HEAVY },
        { name: "Membawa senjata tajam", point: 100, level: ViolationLevel.HEAVY },
        { name: "Penyalahgunaan narkoba", point: 100, level: ViolationLevel.HEAVY },
        { name: "Pelecehan seksual", point: 100, level: ViolationLevel.HEAVY },
        { name: "Pemerasan", point: 75, level: ViolationLevel.HEAVY },
        { name: "Perusakan berat fasilitas", point: 75, level: ViolationLevel.HEAVY },
        { name: "Mengancam guru", point: 100, level: ViolationLevel.HEAVY },
        { name: "Tawuran antar sekolah", point: 100, level: ViolationLevel.HEAVY },
        { name: "Pemalsuan dokumen sekolah", point: 75, level: ViolationLevel.HEAVY },
        { name: "Pencurian berat", point: 75, level: ViolationLevel.HEAVY },
        { name: "Aksi vandalisme besar", point: 75, level: ViolationLevel.HEAVY },
        { name: "Menghasut tawuran", point: 100, level: ViolationLevel.HEAVY },
        { name: "Mengunggah konten kekerasan siswa", point: 75, level: ViolationLevel.HEAVY },
        { name: "Pencemaran nama baik guru", point: 75, level: ViolationLevel.HEAVY },
        { name: "Menyebarkan video tidak pantas", point: 100, level: ViolationLevel.HEAVY },
        { name: "Mengancam keselamatan siswa lain", point: 100, level: ViolationLevel.HEAVY },
        { name: "Membawa obat terlarang", point: 100, level: ViolationLevel.HEAVY },
        { name: "Kekerasan berulang terhadap siswa", point: 100, level: ViolationLevel.HEAVY },
        { name: "Perkelahian berkelompok", point: 75, level: ViolationLevel.HEAVY },
        { name: "Mengganggu keamanan sekolah", point: 75, level: ViolationLevel.HEAVY },
        { name: "Menggunakan narkotika di sekolah", point: 100, level: ViolationLevel.HEAVY },
    ];

    for (const v of violations) {
        await prisma.violation.upsert({
            where: { name: v.name },
            update: {},
            create: v,
        });
    }

    console.log("✅ 80 Master Violations Seeded");
}

async function main() {
    await seedViolations();
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
