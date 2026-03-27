//Files: src/modules/student/domain/entity/Student.ts

import type { FamilyStatus, Gender } from "@/libs/utils/enums";
/**
 * ============================================================
 * STUDENT ENTITY
 * ============================================================
 *
 * Entity ini merepresentasikan agregat utama dari modul Student.
 *
 * Entity ini berisi data inti siswa yang berasal dari model
 * Prisma `Student`.
 *
 * Catatan:
 *
 * - Entity tidak bergantung pada Prisma
 * - Entity tidak digunakan untuk transport data
 * - Identity (`id`) bersifat readonly
 *
 * Layer:
 * Domain Layer
 */

export class StudentEntity {
  constructor(
    /** Identity */
    public readonly id: string,

    /** Student identification */
    public nis: string | null,
    public nisn: string,

    /** Basic identity */
    public name: string,
    public nickname: string | null,
    public gender: Gender,
    public photo: string | null,

    /** Birth information */
    public birthPlace: string,
    public birthDate: Date,

    /** Contact */
    public address: string,
    public phone: string | null,
    public email: string | null,

    /** Religion */
    public religionCode: string,

    /** Government identity */
    public nik: string | null,
    public kkNumber: string | null,

    /** School history */
    public schoolOrigin: string | null,
    public graduationScore: number | null,

    /** Social */
    public instagram: string | null,

    /** Family */
    public familyStatus: FamilyStatus,

    /** Special needs */
    public isDifable: boolean,
    public difableNotes: string | null,

    /** Audit */
    public createdAt: Date,
    public deletedAt: Date | null
  ) {}
}
