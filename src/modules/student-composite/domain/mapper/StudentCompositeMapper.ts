//Files: src/modules/student-composite/domain/mapper/StudentCompositeMapper.ts

import type {StudentCompositePayload} from "@/modules/student-composite/domain/builder/StudentCompositeQuery";
import type {StudentCompositeDTO} from "@/modules/student-composite/domain/dto/StudentCompositeDTO";

/**
 * ============================================================
 * STUDENT COMPOSITE MAPPER
 * ============================================================
 *
 * Mapper ini bertanggung jawab mengubah Prisma payload
 * menjadi StudentCompositeDTO.
 *
 * Peran mapper dalam modul composite ini adalah
 * sebagai **thin mapper**, karena composite bertindak
 * sebagai bridge antara parent dan child module.
 *
 * Prinsip:
 *
 * - KISS
 * - SRP
 * - Tidak membatasi domain child module
 * - Hanya melakukan penyesuaian struktur relasi
 *
 * Flow:
 *
 * Prisma Payload → Mapper → DTO
 */

export class StudentCompositeMapper {
	/**
	 * ============================================================
	 * MAP PRISMA PAYLOAD TO DTO
	 * ============================================================
	 */

	static toDTO (student: StudentCompositePayload): StudentCompositeDTO {
		return {
			/* =====================================================
			 CORE STUDENT
			 ===================================================== */
			id: student.id,
			nis: student.nis,
			nisn: student.nisn,
			name: student.name,
			nickname: student.nickname,
			photo: student.photo,
			gender: student.gender,
			birthPlace: student.birthPlace,
			birthDate: student.birthDate,
			address: student.address,
			phone: student.phone,
			email: student.email,
			religionCode: student.religionCode,
			nik: student.nik,
			kkNumber: student.kkNumber,
			schoolOrigin: student.schoolOrigin,
			graduationScore: student.graduationScore,
			instagram: student.instagram,
			familyStatus: student.familyStatus,
			isDifable: student.isDifable,
			difableNotes: student.difableNotes,
			createdAt: student.createdAt,

			/* =====================================================
			 STUDENT EXTENSIONS
			 ===================================================== */

			profile: student.studentProfile ? {...student.studentProfile} : null,
			facility: student.studentFacility ? {...student.studentFacility} : null,
			health: student.studentHealthAbility ? {...student.studentHealthAbility} : null,
			religionActivity: student.studentReligionActivity ? {...student.studentReligionActivity} : null,
			family: student.studentFamilyInfo ? {...student.studentFamilyInfo} : null,

			/* =====================================================
			 CHILD MODULE COLLECTIONS
			 ===================================================== */

			aids: student.aids,
			achievements: student.achievements,
			attendances: student.attendances,
			enrollments: student.enrollments.map ((e) => ({
				academicYearId: e.academicYearId,
				academicYear: {
					name: e.academicYear.name,
				},
				classId: e.classId,
				class: {
					grade: e.class.grade,
					name: e.class.name,
				},
				status: e.status,
			})),
			point: student.point.map ((p) => ({
				academicYearId: p.academicYearId,
				academicYear: {
					name: p.academicYear.name,
				},
				totalViolationPoint: p.totalViolationPoint,
				totalAchievementPoint: p.totalAchievementPoint,
				totalPoint: p.totalPoint,
				updatedAt: p.updatedAt,
			})),
			parents: student.parents,
			violations: student.violations.map ((v) => ({
				id: v.id,
				violationId: v.violationId,
				point: v.point,
				occurredAt: v.occurredAt,

				violation: {
					name: v.violation.name,
					level: v.violation.level,
				},
			})),

			counselingCases: student.counselingCases.map ((c) => ({
				id: c.id,
				academicYearId: c.academicYearId,
				academicYear: {
					name: c.academicYear.name,
				},
				reason: c.reason,
				source: c.source,
				status: c.status,
				openedAt: c.openedAt,
				closedAt: c.closedAt,
			})),
		};
	}
}
