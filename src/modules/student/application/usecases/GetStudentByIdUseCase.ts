// Files: src/modules/student/application/usecases/GetStudentByIdUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import { AppError } from "@/modules/shared/errors/AppError";
import { STUDENT_ERRORS } from "@/modules/student/domain/constants/studentErrorMessages";
import type { StudentCompositeService } from "@/modules/student-composite/application/services/StudentCompositeService";
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

/**
 * ============================================================
 * GET STUDENT BY ID USE CASE
 * ============================================================
 *
 * Use case ini digunakan untuk mengambil **profil komposit siswa**
 * berdasarkan ID siswa.
 *
 * Data yang diambil meliputi:
 *
 * - Identitas siswa
 * - Profil siswa
 * - Fasilitas siswa
 * - Aktivitas keagamaan siswa
 * - Informasi keluarga siswa
 * - Bantuan siswa
 * - Prestasi siswa
 * - Kehadiran siswa
 * - Riwayat kelas siswa
 * - Orang tua siswa
 * - Pelanggaran siswa
 * - Kasus konseling
 * - Ringkasan poin disiplin
 *
 * Use case ini biasanya digunakan pada:
 *
 * - Halaman detail siswa
 * - Dashboard konseling
 * - Monitoring siswa oleh wali kelas
 *
 * ------------------------------------------------------------
 * TANGGUNG JAWAB
 * ------------------------------------------------------------
 *
 * - Memvalidasi Student ID
 * - Mengambil data siswa dari StudentCompositeService
 * - Mengembalikan profil komposit siswa
 *
 * ------------------------------------------------------------
 * DEPENDENCY
 * ------------------------------------------------------------
 *
 * StudentCompositeService
 *
 * Service ini bertindak sebagai gateway menuju
 * modul StudentComposite yang bertanggung jawab
 * atas seluruh operasi READ siswa.
 *
 * ------------------------------------------------------------
 * FLOW EKSEKUSI
 * ------------------------------------------------------------
 *
 * HTTP Request
 *      ↓
 * StudentController
 *      ↓
 * StudentApplicationService
 *      ↓
 * GetStudentByIdUseCase
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
 * INPUT
 * ------------------------------------------------------------
 *
 * @param studentId ID unik siswa
 *
 * ------------------------------------------------------------
 * OUTPUT
 * ------------------------------------------------------------
 *
 * StudentCompositeDTO
 *
 * ------------------------------------------------------------
 * ERROR YANG DAPAT DILEMPAR
 * ------------------------------------------------------------
 *
 * @throws AppError.validation
 * Jika Student ID tidak valid
 *
 * @throws AppError.notFound
 * Jika siswa tidak ditemukan
 *
 * ------------------------------------------------------------
 * LAYER
 * ------------------------------------------------------------
 *
 * Application Layer
 */

export class GetStudentByIdUseCase extends BaseUseCase<string, StudentCompositeDTO> {
  constructor(private readonly compositeService: StudentCompositeService) {
    super();
  }

  protected async handle(studentId: string): Promise<StudentCompositeDTO> {
    /**
     * Validasi ID siswa
     */
    if (!studentId) {
      throw AppError.validation(STUDENT_ERRORS.STUDENTID_INVALID);
    }

    /**
     * Ambil data dari StudentComposite
     */
    const result = await this.compositeService.getStudentComposite(studentId);

    /**
     * Jika service gagal, lempar error ke BaseUseCase
     */
    if (result.isFailure) {
      throw result.error;
    }

    return result.getValue();
  }
}
