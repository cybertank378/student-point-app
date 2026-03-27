//Files: src/modules/student/domain/constants/studentErrorMessages.ts
/**
 * Kumpulan pesan error domain Student.
 */

export const STUDENT_ERRORS = {
  STUDENTID_INVALID: "Student ID tidak valid",
  STUDENT_NISN_INVALID: "Nomor Induk Siswa Nasional tidak valid",
  STUDENT_ID_IS_REQUIRED: "Student ID wajib diisi.",
  STUDENT_NOT_FOUND: "Siswa tidak ditemukan.",

  BIRTHPLACE_IS_REQUIRED: "Tempat lahir wajib diisi.",

  STUDENT_NISN_REQUIRED: "NISN wajib diisi",

  STUDENT_NAME_REQUIRED: "Nama siswa wajib diisi",

  NISN_ALREADY_EXISTS: "NISN sudah digunakan",

  NOT_FOUND: "Data siswa tidak ditemukan",

  CANNOT_CREATE_STUDENT_DATA: "Gagal membuat data siswa",

  FAILED_UPDATE_STUDENT: "Gagal memperbarui data siswa",

  STUDENT_ALREADY_DELETED: "Data siswa sudah dihapus",

  IMPORT_DATA_EMPTY: "Data import tidak boleh kosong",

  NO_DATA_EXPORTED_AVAILABLE: "Tidak ada data untuk diexport",

  PAGE_INVALID: "Halaman tidak valid",

  MAX_LIMIT_INVALID: "Limit melebihi batas",
  FAILED_SAVED_FILES: "Gagal menyimpan file.",
  FAILED_TO_DELETE_OLD_FILES: "Gagal menghapus file lama.",
  FAILED_TO_CREATE_FOLDER_UPLOAD_STUDENT: "Gagal membuat folder upload student.",
  FILE_NOT_FOUND: "File tidak ditemukan.",
  STUDENT_NAME_MINIMUM_CHAR: "Nama siswa minimal harus terdiri dari 2 karakter.",
  ADDRESS_IS_REQUIRED: "Alamat siswa tidak boleh kosong",
  RELIGION_IS_REQUIRED: "Agama siswa tidak boleh kosong",
  NIS_INVALID: "Nomor Induk Siswa Tidak Valid",
  STUDENT_STATISTICS_NOT_FOUND: "Statistik Siswa Tidak Ditemunkan",
} as const;
