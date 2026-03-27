//Files: src/modules/student/domain/dto/CreateStudentDTO.ts
import type { FamilyStatus, Gender } from "@/libs/utils/enums";

/**
 * ============================================================
 * CREATE STUDENT DTO
 * ============================================================
 *
 * DTO ini digunakan untuk proses pembuatan data siswa baru.
 *
 * DTO ini biasanya berasal dari HTTP request
 * dan digunakan oleh CreateStudentUseCase.
 *
 * Catatan:
 *
 * - Tidak mengandung id karena id dibuat oleh sistem
 * - Field opsional mengikuti schema Prisma
 *
 * Layer:
 * Domain (DTO)
 */

export interface CreateStudentDTO {
  nis?: string | null;

  nisn: string;

  name: string;

  nickname?: string | null;

  gender: Gender;

  photo?: string | null;

  birthPlace: string;

  birthDate: Date;

  address: string;

  phone?: string | null;

  email?: string | null;

  religionCode: string;

  nik?: string | null;

  kkNumber?: string | null;

  schoolOrigin?: string | null;

  graduationScore?: number | null;

  instagram?: string | null;

  familyStatus?: FamilyStatus;

  isDifable?: boolean;

  difableNotes?: string | null;
}
