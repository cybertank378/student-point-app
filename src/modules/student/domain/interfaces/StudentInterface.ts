//Files: src/modules/student/domain/interfaces/StudentInterface.ts
import type {
  BulkImportStudentDTO,
  CreateStudentDTO,
  DeleteStudentDTO,
  StudentIdentityDTO,
  StudentStatisticDTO,
  UpdateStudentDTO,
} from "@/modules/student/domain/dto";

/**
 * ============================================================
 * STUDENT REPOSITORY INTERFACE
 * ============================================================
 *
 * Kontrak repository untuk modul Student.
 *
 * Repository ini hanya menangani operasi WRITE
 * terhadap entity Student.
 *
 * Operasi READ kompleks tidak dilakukan di modul ini,
 * melainkan pada modul `student-composite`.
 *
 * Layer:
 * Domain
 */

export interface StudentInterface {
  /**
   * ============================================================
   * CREATE STUDENT
   * ============================================================
   *
   * Membuat data siswa baru.
   */

  create(data: CreateStudentDTO): Promise<StudentIdentityDTO>;

  /**
   * ============================================================
   * UPDATE STUDENT
   * ============================================================
   *
   * Memperbarui data siswa.
   */

  update(data: UpdateStudentDTO): Promise<StudentIdentityDTO>;

  /**
   * ============================================================
   * DELETE STUDENT
   * ============================================================
   *
   * Menghapus siswa secara soft delete.
   */

  delete(data: DeleteStudentDTO): Promise<void>;

  /**
   * ============================================================
   * FIND STUDENT BY ID
   * ============================================================
   */

  findById(studentId: string): Promise<StudentIdentityDTO | null>;

  /**
   * ============================================================
   * FIND STUDENT BY NIS
   * ============================================================
   */

  findByNis(nis: string): Promise<StudentIdentityDTO | null>;

  /**
   * ============================================================
   * CHECK EXISTING NISN
   * ============================================================
   */

  existsByNISN(nisn: string): Promise<boolean>;

  /**
   * ============================================================
   * CHECK EXISTING NIS
   * ============================================================
   */

  existsByNIS(nis: string): Promise<boolean>;

  /**
   * ============================================================
   * BULK CREATE STUDENT
   * ============================================================
   *
   * Digunakan pada proses import Excel.
   */

  bulkImportCreate(data: BulkImportStudentDTO[]): Promise<number>;

  /**
   * ============================================================
   * STATISTIC STUDENT
   * ============================================================
   *
   * Digunakan pada proses import Excel.
   */

  getStudentStatistics(): Promise<StudentStatisticDTO>;
}
