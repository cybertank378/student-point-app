//Files: src/modules/student/domain/dto/StudentExcelRowDTO.ts

import type { EducationLevel, EnrollmentStatus, FamilyStatus, Gender, HouseOwnership, ParentType } from "@/libs/utils/enums";

/**
 * ============================================================
 * STUDENT EXCEL ROW DTO
 * ============================================================
 *
 * DTO ini merepresentasikan satu baris data Excel
 * sebelum diproses menjadi BulkImportStudentDTO.
 *
 * DTO ini hanya digunakan pada proses parsing Excel
 * dan tidak digunakan pada domain utama.
 */

export interface StudentExcelRowDTO {
  /* =========================================================
	 CORE STUDENT
	 ========================================================= */

  NIS?: string;

  NISN: string;

  Name: string;

  Nickname?: string;

  Gender: Gender;

  BirthPlace: string;

  BirthDate: string | Date;

  Address: string;

  Phone?: string;

  Email?: string;

  ReligionCode: string;

  NIK?: string;

  KKNumber?: string;

  SchoolOrigin?: string;

  GraduationScore?: number;

  Instagram?: string;

  FamilyStatus?: FamilyStatus;

  IsDifable?: boolean;

  DifableNotes?: string;

  /* =========================================================
	 PROFILE
	 ========================================================= */

  ChildOrder?: number;

  TotalSiblings?: number;

  DistanceToSchool?: string;

  Transport?: string;

  Hobby?: string;

  Dream?: string;

  CloseFriend?: string;

  /* =========================================================
	 FACILITY
	 ========================================================= */

  HasPC?: boolean;

  HasLaptop?: boolean;

  HasPhone?: boolean;

  InternetAccess?: string;

  /* =========================================================
	 HEALTH
	 ========================================================= */

  Inclusion?: boolean;

  CanRead?: boolean;

  CanWrite?: boolean;

  CanCount?: boolean;

  CanSpeak?: boolean;

  CanFollowCeremony?: boolean;

  CanDoSport?: boolean;

  CanSeeBoard?: boolean;

  CanHearClearly?: boolean;

  CanWalkRun?: boolean;

  CanHoldPen?: boolean;

  DominantHandRight?: boolean;

  DiseaseHistory?: string;

  /* =========================================================
	 RELIGION ACTIVITY
	 ========================================================= */

  PrayFiveTimes?: boolean;

  OftenMissPrayer?: string;

  QuranStudyLevel?: string;

  WorshipActivities?: string;

  WorshipLocation?: string;

  /* =========================================================
	 FAMILY
	 ========================================================= */

  LivingWith?: string;

  HouseOwnership?: HouseOwnership;

  HeadOfFamilyName?: string;

  FamilyCardAddress?: string;

  /* =========================================================
	 PARENTS
	 ========================================================= */

  ParentRole?: ParentType;

  ParentName?: string;

  ParentPhone?: string;

  ParentEducation?: EducationLevel;

  ParentJob?: string;

  ParentIncome?: string;

  ParentReligionCode?: string;

  ParentAddress?: string;

  GuardianRelation?: string;

  /* =========================================================
	 ENROLLMENT
	 ========================================================= */

  AcademicYearId?: string;

  ClassId?: string;

  EnrollmentStatus?: EnrollmentStatus;

  /* =========================================================
	 STUDENT AID
	 ========================================================= */

  AidAcademicYearId?: string;

  KJP?: boolean;

  PIP?: boolean;
}
