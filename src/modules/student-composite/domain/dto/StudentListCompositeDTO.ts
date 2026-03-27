//Files: src/modules/student-composite/domain/dto/StudentListCompositeDTO.ts


import type {
	EnrollmentStatus,
	Gender,
	FamilyStatus
} from "@/libs/utils/enums"

/**
 * ============================================================
 * STUDENT LIST COMPOSITE DTO
 * ============================================================
 *
 * DTO ringan untuk menampilkan daftar siswa.
 *
 * Digunakan pada:
 *
 * - Student Table
 * - Student Search
 * - Student Export
 * - Dashboard monitoring siswa
 *
 * DTO ini hanya mengambil data minimal
 * agar query tetap cepat untuk pagination besar.
 */

export interface StudentListCompositeDTO {

	/* =========================================================
	 CORE STUDENT
	 ========================================================= */

	id: string

	nis: string | null

	nisn: string

	name: string

	nickname: string | null

	photo: string | null

	gender: Gender

	religionCode: string

	familyStatus: FamilyStatus

	isDifable: boolean

	schoolOrigin: string | null

	createdAt: Date

	/* =========================================================
	 ACTIVE ENROLLMENT
	 ========================================================= */

	enrollment: {

		academicYearId: string

		academicYearName: string | null

		classId: string | null

		className: string | null

		grade: string | null

		status: EnrollmentStatus | null

	} | null

	/* =========================================================
	 DISCIPLINE POINT SUMMARY
	 ========================================================= */

	pointSummary: {

		academicYearId: string

		totalViolationPoint: number

		totalAchievementPoint: number

		totalPoint: number

		updatedAt: Date

	} | null

}