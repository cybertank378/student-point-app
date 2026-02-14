# Student Point App

Aplikasi **manajemen poin siswa** berbasis Next.js untuk membantu sekolah mencatat, memantau, dan menindaklanjuti **pelanggaran** serta **prestasi** siswa secara terstruktur.

## Fitur Utama

- **Autentikasi & otorisasi berbasis role** (`ADMIN`, `TEACHER`, `STUDENT`, `PARENT`).
- **Manajemen data master**: tahun ajaran, rombel/kelas, guru, pengguna, agama.
- **Manajemen siswa**: profil siswa, status siswa, penempatan rombel.
- **Master pelanggaran & prestasi** dengan sistem poin.
- **Transaksi pelanggaran siswa** berikut alur penanganan/resolusi.
- **Dashboard berbasis peran** untuk ringkasan data.

## Teknologi yang Digunakan

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS 4
- **Validasi**: Zod
- **Auth util**: JOSE (JWT), bcryptjs

## Struktur Singkat Proyek

- `src/app` → halaman aplikasi dan API route (App Router).
- `src/modules` → domain module (auth, student, teacher, violation, achievement, dll).
- `src/sections` → komponen section-level untuk halaman dashboard/fitur.
- `prisma` → schema, migrasi, dan seed database.

## Menjalankan Proyek Secara Lokal

### 1) Prasyarat

- Node.js 20+
- PostgreSQL aktif

### 2) Install dependency

```bash
npm install
```

### 3) Siapkan environment

Buat file `.env` di root project:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
ACCESS_TOKEN_SECRET="ganti_dengan_secret_access_token"
REFRESH_TOKEN_SECRET="ganti_dengan_secret_refresh_token"
NODE_ENV="development"
```

### 4) Generate Prisma Client & migrasi

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5) (Opsional) Seed data

```bash
npm run prisma:seed
```

### 6) Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Scripts

- `npm run dev` → jalankan server development.
- `npm run build` → build aplikasi untuk production.
- `npm run start` → jalankan hasil build production.
- `npm run lint` → cek kualitas kode dengan Biome.
- `npm run format` → format kode dengan Biome.
- `npm run prisma:generate` → generate Prisma Client.
- `npm run prisma:migrate` → jalankan migrasi database.
- `npm run prisma:seed` → isi data awal.
- `npm run prisma:studio` → buka Prisma Studio.

## Catatan

- Pastikan nilai secret JWT cukup panjang dan aman.
- Untuk production, gunakan `NODE_ENV=production` dan konfigurasi cookie/domain sesuai deployment.
