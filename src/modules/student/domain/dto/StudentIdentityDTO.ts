//Files: src/modules/student/domain/dto/StudentIdentityDTO.ts

/**
 * ============================================================
 * STUDENT IDENTITY DTO
 * ============================================================
 *
 * DTO minimal yang merepresentasikan identitas siswa.
 *
 * Digunakan sebagai response setelah operasi create
 * atau update siswa.
 */

export interface StudentIdentityDTO {
  id: string;
  nis: string | null;
  nisn: string;
}
