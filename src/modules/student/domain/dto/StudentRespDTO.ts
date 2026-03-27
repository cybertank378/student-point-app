//Files: src/modules/student/domain/dto/StudentRespDTO.ts

import type {
  EducationLevel,
  FamilyStatus,
  Gender,
  HouseOwnership,
  ParentType,EnrollmentStatus
} from "@/libs/utils/enums";

/**
 * ============================================================
 * HEADER FILE
 * ============================================================
 *
 * StudentRespDTO
 *
 * @module student
 * @layer domain/dto
 *
 * DTO ini merepresentasikan data siswa yang dikirim
 * oleh API ke frontend.
 */

export interface StudentRespDTO {

  /* =========================================================
   IDENTITY
   ========================================================= */

  id: string;
  nis: string | null;
  nisn: string;

  /* =========================================================
   BASIC INFORMATION
   ========================================================= */

  name: string;
  nickname: string | null;
  photo: string | null;

  gender: Gender;
  birthPlace: string;
  birthDate: Date;
  religionCode: string;

  /* =========================================================
   CONTACT INFORMATION
   ========================================================= */

  address: string;
  phone: string | null;
  email: string | null;

  /* =========================================================
   ADMINISTRATIVE DATA
   ========================================================= */

  nik: string | null;
  kkNumber: string | null;
  schoolOrigin: string | null;
  graduationScore: number | null;
  instagram: string | null;

  /* =========================================================
   STUDENT STATUS
   ========================================================= */

  familyStatus: FamilyStatus;
  isDifable: boolean;
  difableNotes: string | null;

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
    livingWith: string;
    houseOwnership: HouseOwnership | null;
    headOfFamilyName: string;
    familyCardAddress: string;
    familyCardFile: string | null;
  } | null;

  /* =========================================================
   PARENT INFORMATION
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
   METADATA
   ========================================================= */

  createdAt: Date;
}