//Files: src/modules/student-composite/domain/types/StudentCollectionKey.ts
import type {
	StudentCompositeDTO
} from "@/modules/student-composite/domain/dto/StudentCompositeDTO"

/**
 * ============================================================
 * STUDENT COLLECTION KEY
 * ============================================================
 *
 * Utility type untuk menghasilkan union type
 * dari seluruh property DTO yang berbentuk array.
 *
 * Digunakan untuk menentukan koleksi data
 * turunan siswa yang dapat diakses melalui
 * composite module.
 *
 * Contoh koleksi:
 *
 * - aids
 * - achievements
 * - attendances
 * - enrollments
 * - point
 * - parents
 * - violations
 * - counselingCases
 *
 * Prinsip desain:
 *
 * - DRY
 * - Type-safe
 * - Auto-sync dengan DTO
 *
 * Jika DTO berubah, union type ini otomatis
 * ikut berubah tanpa perlu update manual.
 */

export type StudentCollectionKey = {

	[K in keyof StudentCompositeDTO]:

	StudentCompositeDTO[K] extends ReadonlyArray<any>

		? K

		: never

}[keyof StudentCompositeDTO]