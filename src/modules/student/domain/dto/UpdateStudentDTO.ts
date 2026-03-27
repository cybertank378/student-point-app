//Files: src/modules/student/domain/dto/UpdateStudentDTO.ts
import type { StudentCompositeDTO } from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

/**
 * DTO untuk update siswa dengan semantics PATCH.
 *
 * Hanya id yang wajib.
 * Semua field lain optional.
 */

type UpdatableStudentFields = Omit<StudentCompositeDTO, "nisn">;

export type UpdateStudentDTO =
	{ id: string } &
	Partial<UpdatableStudentFields> & {
	nisn?: string;
};
