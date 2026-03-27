//Files: src/modules/student/domain/dto/DeleteStudentDTO.ts

/**
 * ============================================================
 * DELETE STUDENT DTO
 * ============================================================
 *
 * DTO ini digunakan untuk proses penghapusan siswa.
 *
 * Sistem menggunakan mekanisme soft delete
 * dengan mengisi field deletedAt.
 *
 * Layer:
 * Domain (DTO)
 */

export interface DeleteStudentDTO {
  id: string;
}
