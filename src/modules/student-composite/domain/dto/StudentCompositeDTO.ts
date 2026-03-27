// Files: src/modules/student-composite/domain/dto/StudentCompositeDTO.ts
import type {
	AttendanceStatus,
	CaseSource,
	CaseStatus,
	EducationLevel,
	EnrollmentStatus,
	FamilyStatus,
	Gender,
	HouseOwnership,
	ParentType,
	ViolationLevel,
} from "@/libs/utils/enums";

/**
 * ============================================================
 * STUDENT COMPOSITE DTO
 * ============================================================
 *
 * DTO ini merupakan **Composite Read Model** yang menggabungkan
 * berbagai modul terkait siswa dalam satu response.
 *
 * Modul sumber data:
 *
 * - Student
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
 * - StudentPoint
 * - CounselingCase
 *
 * DTO ini digunakan pada:
 *
 * - Halaman profil siswa
 * - Dashboard monitoring siswa
 * - Dashboard counseling
 *
 * DTO ini hanya digunakan untuk **operasi READ**.
 */

export interface StudentCompositeDTO {
	/* =========================================================
	 CORE STUDENT
	 ========================================================= */

	id: string;
	nis: string | null;
	nisn: string;
	name: string;
	nickname: string | null;
	photo: string | null;
	gender: Gender;
	birthPlace: string;
	birthDate: Date;
	address: string;
	phone: string | null;
	email: string | null;
	religionCode: string;

	/* =========================================================
	 DATA ADMINISTRASI SISWA
	 ========================================================= */

	nik: string | null;
	kkNumber: string | null;
	schoolOrigin: string | null;
	graduationScore: number | null;
	instagram: string | null;

	/* =========================================================
	 STATUS SISWA
	 ========================================================= */

	familyStatus: FamilyStatus | null;
	isDifable: boolean;
	difableNotes: string | null;
	createdAt: Date;

	/* =========================================================
	 STUDENT PROFILE
	 ========================================================= */

	profile: {
		childOrder: number | null;
		totalSiblings: number | null;
		distanceToSchool: string | null;
		transport: string | null;
		hobby: string | null;
		dream: string | null;
		closeFriend: string | null;
	} | null;

	/* =========================================================
	 STUDENT FACILITY
	 ========================================================= */

	facility: {
		hasPC: boolean;
		hasLaptop: boolean;
		hasPhone: boolean;
		internetAccess: string | null;
	} | null;

	/* =========================================================
	 STUDENT HEALTH ABILITY
	 ========================================================= */

	health: {
		inclusion: boolean;
		canRead: boolean;
		canWrite: boolean;
		canCount: boolean;
		canSpeak: boolean;
		canFollowCeremony: boolean;
		canDoSport: boolean;
		canSeeBoard: boolean;
		canHearClearly: boolean;
		canWalkRun: boolean;
		canHoldPen: boolean;
		dominantHandRight: boolean;
		diseaseHistory: string | null;
		hasPsychologistLetter: boolean | null;
		hasIQTest: boolean | null;
		iqScore: number | null;
	} | null;

	/* =========================================================
	 RELIGION ACTIVITY
	 ========================================================= */

	religionActivity: {
		prayFiveTimes: boolean | null;
		oftenMissPrayer: string | null;
		quranStudyLevel: string | null;
		worshipActivities: string | null;
		worshipLocation: string | null;
	} | null;

	/* =========================================================
	 FAMILY INFORMATION
	 ========================================================= */

	family: {
		livingWith: string | null;
		houseOwnership: HouseOwnership | null;
		headOfFamilyName: string;
		familyCardAddress: string;
		documents: string[] | null;
	} | null;

	/* =========================================================
	 STUDENT AID PROGRAMS
	 ========================================================= */

	aids: {
		academicYearId: string;
		academicYear: {
			name: string;
		};
		kjp: boolean;
		pip: boolean;
	}[];

	/* =========================================================
	 STUDENT ACHIEVEMENTS
	 ========================================================= */

	achievements: {
		id: string;
		achievementId: string;
		academicYearId: string;
		academicYear: {
			name: string;
		};
		point: number;
		achievedAt: Date;
	}[];

	/* =========================================================
	 STUDENT ATTENDANCE
	 ========================================================= */

	attendances: {
		date: Date;
		status: AttendanceStatus;
		note: string | null;
	}[];

	/* =========================================================
	 STUDENT ENROLLMENTS
	 ========================================================= */

	enrollments: {
		academicYearId: string;
		academicYear: {
			name: string;
		};
		classId: string;
		class: {
			grade: string;
			name: string;
		};
		status: EnrollmentStatus;
	}[];

	/* =========================================================
	 DISCIPLINE POINT SUMMARY
	 ========================================================= */

	point: {
		academicYearId: string;
		academicYear: {
			name: string;
		};
		totalViolationPoint: number;
		totalAchievementPoint: number;
		totalPoint: number;
		updatedAt: Date;
	}[];

	/* =========================================================
	 STUDENT PARENTS
	 ========================================================= */

	parents: {
		role: ParentType;
		parent: {
			id: string;
			name: string;
			email: string | null;
			phone: string;
			education: EducationLevel;
			job: string;
			income: string | null;
			religionCode: string;
			address: string;
			guardianRelation: string | null;
		};
	}[];

	/* =========================================================
	 STUDENT VIOLATIONS
	 ========================================================= */

	violations: {
		id: string;
		violationId: string;
		point: number;
		occurredAt: Date;
		violation: {
			name: string;
			level: ViolationLevel;
		};
	}[];

	/* =========================================================
	 COUNSELING CASES
	 ========================================================= */

	counselingCases: {
		id: string;
		academicYearId: string;
		academicYear: {
			name: string;
		};
		reason: string;
		source: CaseSource;
		status: CaseStatus;
		openedAt: Date;
		closedAt: Date | null;
	}[];
}
