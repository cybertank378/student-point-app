//Files: src/modules/student/infrastructure/services/StudentInsertService.ts

import type { Prisma } from "@/generated/prisma";
import type { BulkImportStudentDTO } from "@/modules/student/domain/dto";

/**
 * ============================================================
 * STUDENT INSERT SERVICE
 * ============================================================
 *
 * Bertanggung jawab untuk membuat data utama siswa.
 *
 * Prinsip:
 * - SRP → hanya membuat student
 * - DRY → normalisasi nilai optional
 *
 * Layer:
 * Infrastructure Service
 */
export class StudentInsertService {
  /**
   * Membuat record student di database.
   *
   * @param tx Prisma Transaction Client
   * @param item DTO siswa
   * @returns Student Record
   */
  static async createStudent(tx: Prisma.TransactionClient, item: BulkImportStudentDTO) {
    const normalize = <T>(v: T | null | undefined): T | undefined => v ?? undefined;

    return tx.student.create({
      data: {
        nis: normalize(item.student.nis),
        nisn: item.student.nisn,

        name: item.student.name,
        nickname: normalize(item.student.nickname),

        gender: item.student.gender,
        birthPlace: item.student.birthPlace,
        birthDate: item.student.birthDate,

        address: item.student.address,
        phone: normalize(item.student.phone),
        email: normalize(item.student.email),

        religionCode: item.student.religionCode,

        nik: normalize(item.student.nik),
        kkNumber: normalize(item.student.kkNumber),

        schoolOrigin: normalize(item.student.schoolOrigin),
        graduationScore: normalize(item.student.graduationScore),

        instagram: normalize(item.student.instagram),

        familyStatus: item.student.familyStatus ?? "COMPLETE",

        isDifable: item.student.isDifable ?? false,
        difableNotes: normalize(item.student.difableNotes),
      },
    });
  }
}
