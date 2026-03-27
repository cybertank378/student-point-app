//Files: src/modules/student/domain/dto/BulkImportStudentDTO.ts

import type { EducationLevel, EnrollmentStatus, FamilyStatus, Gender, HouseOwnership, ParentType } from "@/libs/utils/enums";

/**
 * ============================================================
 * IMPORT STUDENT DTO
 * ============================================================
 *
 * DTO ini digunakan untuk proses import siswa dari file Excel
 * atau CSV yang berisi data siswa beserta sebagian data
 * turunannya.
 *
 * DTO ini tidak langsung merepresentasikan tabel database,
 * tetapi menjadi struktur transport untuk proses import.
 *
 * Setiap bagian data akan diteruskan ke module yang sesuai.
 *
 * Digunakan oleh:
 *
 * - ImportStudentUseCase
 *
 * Layer:
 * Domain (DTO)
 */

export interface BulkImportStudentDTO {
  /* =========================================================
     CORE STUDENT
     ========================================================= */

  student: {
    nis?: string | null;

    nisn: string;

    name: string;

    nickname?: string | null;

    gender: Gender;

    birthPlace: string;

    birthDate: Date;

    address: string;

    phone?: string | null;

    email?: string | null;

    religionCode: string;

    nik?: string | null;

    kkNumber?: string | null;

    schoolOrigin?: string | null;

    graduationScore?: number | null;

    instagram?: string | null;

    familyStatus?: FamilyStatus;

    isDifable?: boolean;

    difableNotes?: string | null;
  };

  /* =========================================================
     STUDENT PROFILE
     ========================================================= */

  profile?: {
    childOrder?: number;

    totalSiblings?: number;

    distanceToSchool?: string;

    transport?: string;

    hobby?: string;

    dream?: string;

    closeFriend?: string;
  };

  /* =========================================================
     STUDENT FACILITY
     ========================================================= */

  facility: {
    hasPC?: boolean;
    hasLaptop?: boolean;
    hasPhone?: boolean;
    internetAccess?: string;
  };

  /* =========================================================
     STUDENT HEALTH
     ========================================================= */

  health?: {
    inclusion?: boolean;
    canRead?: boolean;
    canWrite?: boolean;
    canCount?: boolean;
    canSpeak?: boolean;
    canFollowCeremony?: boolean;
    canDoSport?: boolean;
    canSeeBoard?: boolean;
    canHearClearly?: boolean;
    canWalkRun?: boolean;
    canHoldPen?: boolean;
    dominantHandRight?: boolean;
    diseaseHistory?: string;
  };

  /* =========================================================
     RELIGION ACTIVITY
     ========================================================= */

  religionActivity?: {
    prayFiveTimes?: boolean;
    oftenMissPrayer?: string;
    quranStudyLevel?: string;
    worshipActivities?: string;
    worshipLocation?: string;
  };

  /* =========================================================
     FAMILY INFORMATION
     ========================================================= */

  family?: {
    livingWith?: string;
    houseOwnership?: HouseOwnership;
    headOfFamilyName?: string;
    familyCardAddress?: string;
  };

  /* =========================================================
     PARENTS
     ========================================================= */

  parents?: {
    role: ParentType;
    name: string;
    phone: string;
    education: EducationLevel;
    job: string;
    income?: string;
    religionCode: string;
    address: string;
    guardianRelation?: string;
  }[];

  /* =========================================================
     ENROLLMENT
     ========================================================= */

  enrollment?: {
    academicYearId: string;
    classId: string;
    status?: EnrollmentStatus;
  };

  /* =========================================================
     STUDENT AID
     ========================================================= */

  aids?: {
    academicYearId: string;
    kjp?: boolean;
    pip?: boolean;
  }[];
}
