//Files: src/modules/student-composite/application/usecases/GetCompositeByIdUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import { AppError } from "@/modules/shared/errors/AppError";

import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

import type { StudentCompositeInterface } from "@/modules/student-composite/domain/interfaces/StudentCompositeInterface";

/**
 * ============================================================
 * GET STUDENT COMPOSITE BY ID USE CASE
 * ============================================================
 *
 * Use case ini bertanggung jawab untuk mengambil
 * **profil komposit lengkap siswa** berdasarkan ID.
 *
 * Profil komposit merupakan agregasi data dari
 * berbagai modul child yang berhubungan dengan siswa.
 *
 * Data yang diambil meliputi:
 *
 * - Data inti siswa
 * - StudentProfile
 * - StudentFacility
 * - StudentHealthAbility
 * - StudentReligionActivity
 * - StudentFamilyInfo
 * - StudentAid
 * - StudentAchievement
 * - StudentAttendance
 * - StudentEnrollment
 * - StudentParent
 * - StudentViolation
 * - CounselingCase
 * - StudentPoint
 *
 * Use case ini biasanya digunakan oleh:
 *
 * - Halaman detail siswa
 * - Dashboard counseling
 * - Monitoring siswa oleh wali kelas
 *
 * ------------------------------------------------------------
 * FLOW EKSEKUSI
 * ------------------------------------------------------------
 *
 * Controller
 *      ↓
 * StudentCompositeService
 *      ↓
 * GetCompositeByIdUseCase
 *      ↓
 * StudentCompositeRepository
 *      ↓
 * Prisma
 *
 * ------------------------------------------------------------
 * VALIDASI
 * ------------------------------------------------------------
 *
 * - studentId wajib diisi
 * - siswa harus ditemukan
 *
 * ------------------------------------------------------------
 * DEPENDENCY
 * ------------------------------------------------------------
 *
 * StudentCompositeInterface
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

interface Request {
  studentId: string;
}

export class GetCompositeByIdUseCase extends BaseUseCase<Request, StudentCompositeDTO> {
  constructor(readonly repository: StudentCompositeInterface) {
    super();
  }

  protected async handle(request: Request): Promise<StudentCompositeDTO> {
    const { studentId } = request;

    if (!studentId) {
      throw AppError.validation("Student ID wajib diisi");
    }

    const student = await this.repository.findById(studentId);

    if (!student) {
      throw AppError.notFound("Siswa tidak ditemukan");
    }

    return student;
  }
}
