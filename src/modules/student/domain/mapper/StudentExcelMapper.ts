// src/modules/student/domain/mapper/StudentExcelMapper.ts
// Files: src/modules/student/infrastructure/mappers/StudentExcelMapper.ts

import type { EducationLevel, EnrollmentStatus, FamilyStatus, Gender, HouseOwnership, ParentType } from "@/libs/utils/enums";
import type { BulkImportStudentDTO } from "@/modules/student/domain/dto/BulkImportStudentDTO";

/**
 * ============================================================
 * STUDENT EXCEL MAPPER
 * ============================================================
 *
 * Mapper untuk mengubah row Excel menjadi BulkImportStudentDTO
 *
 * Digunakan pada proses:
 * - Import siswa massal
 *
 * Layer:
 * Infrastructure
 */

export class StudentExcelMapper {
  static toDTO(row: Record<string, unknown>): BulkImportStudentDTO {
    const get = <T>(key: string): T | undefined => row[key] as T | undefined;

    return {
      /* =====================================================
             CORE STUDENT
             ===================================================== */

      student: {
        nis: get<string>("NIS") ?? null,

        nisn: get<string>("NISN")!,

        name: get<string>("Name")!,

        nickname: get<string>("Nickname") ?? null,

        gender: get<Gender>("Gender")!,

        birthPlace: get<string>("BirthPlace")!,

        birthDate: StudentExcelMapper.parseDate(get("BirthDate")),

        address: get<string>("Address")!,

        phone: get<string>("Phone") ?? null,

        email: get<string>("Email") ?? null,

        religionCode: get<string>("ReligionCode")!,

        nik: get<string>("NIK") ?? null,

        kkNumber: get<string>("KKNumber") ?? null,

        schoolOrigin: get<string>("SchoolOrigin") ?? null,

        graduationScore: get<number>("GraduationScore") ?? null,

        instagram: get<string>("Instagram") ?? null,

        familyStatus: get<FamilyStatus>("FamilyStatus"),

        isDifable: StudentExcelMapper.parseBoolean(get("IsDifable")),

        difableNotes: get<string>("DifableNotes") ?? null,
      },

      /* =====================================================
             STUDENT PROFILE
             ===================================================== */

      profile:
        get("ChildOrder") || get("TotalSiblings") || get("DistanceToSchool") || get("Transport")
          ? {
              childOrder: get<number>("ChildOrder"),
              totalSiblings: get<number>("TotalSiblings"),
              distanceToSchool: get<string>("DistanceToSchool"),
              transport: get<string>("Transport"),
              hobby: get<string>("Hobby"),
              dream: get<string>("Dream"),
              closeFriend: get<string>("CloseFriend"),
            }
          : undefined,

      /* =====================================================
             STUDENT FACILITY
             ===================================================== */

      facility: {
        hasPC: StudentExcelMapper.parseBoolean(get("HasPC")),
        hasLaptop: StudentExcelMapper.parseBoolean(get("HasLaptop")),
        hasPhone: StudentExcelMapper.parseBoolean(get("HasPhone")),
        internetAccess: get<string>("InternetAccess"),
      },

      /* =====================================================
             STUDENT HEALTH
             ===================================================== */

      health:
        get("Inclusion") !== undefined
          ? {
              inclusion: StudentExcelMapper.parseBoolean(get("Inclusion")),
              canRead: StudentExcelMapper.parseBoolean(get("CanRead")),
              canWrite: StudentExcelMapper.parseBoolean(get("CanWrite")),
              canCount: StudentExcelMapper.parseBoolean(get("CanCount")),
              canSpeak: StudentExcelMapper.parseBoolean(get("CanSpeak")),
              canFollowCeremony: StudentExcelMapper.parseBoolean(get("CanFollowCeremony")),
              canDoSport: StudentExcelMapper.parseBoolean(get("CanDoSport")),
              canSeeBoard: StudentExcelMapper.parseBoolean(get("CanSeeBoard")),
              canHearClearly: StudentExcelMapper.parseBoolean(get("CanHearClearly")),
              canWalkRun: StudentExcelMapper.parseBoolean(get("CanWalkRun")),
              canHoldPen: StudentExcelMapper.parseBoolean(get("CanHoldPen")),
              dominantHandRight: StudentExcelMapper.parseBoolean(get("DominantHandRight")),
              diseaseHistory: get<string>("DiseaseHistory"),
            }
          : undefined,

      /* =====================================================
             RELIGION ACTIVITY
             ===================================================== */

      religionActivity:
        get("PrayFiveTimes") !== undefined
          ? {
              prayFiveTimes: StudentExcelMapper.parseBoolean(get("PrayFiveTimes")),
              oftenMissPrayer: get<string>("OftenMissPrayer"),
              quranStudyLevel: get<string>("QuranStudyLevel"),
              worshipActivities: get<string>("WorshipActivities"),
              worshipLocation: get<string>("WorshipLocation"),
            }
          : undefined,

      /* =====================================================
             FAMILY INFORMATION
             ===================================================== */

      family:
        get("LivingWith") || get("HeadOfFamilyName") || get("FamilyCardAddress")
          ? {
              livingWith: get<string>("LivingWith"),
              houseOwnership: get<HouseOwnership>("HouseOwnership"),
              headOfFamilyName: get<string>("HeadOfFamilyName"),
              familyCardAddress: get<string>("FamilyCardAddress"),
            }
          : undefined,

      /* =====================================================
             PARENTS
             ===================================================== */

      parents: get("ParentName")
        ? [
            {
              role: get<ParentType>("ParentRole")!,

              name: get<string>("ParentName")!,

              phone: get<string>("ParentPhone")!,

              education: get<EducationLevel>("ParentEducation")!,

              job: get<string>("ParentJob")!,

              income: get<string>("ParentIncome"),

              religionCode: get<string>("ParentReligionCode")!,

              address: get<string>("ParentAddress")!,

              guardianRelation: get<string>("GuardianRelation"),
            },
          ]
        : undefined,

      /* =====================================================
             ENROLLMENT
             ===================================================== */

      enrollment: get("ClassId")
        ? {
            academicYearId: get<string>("AcademicYearId")!,
            classId: get<string>("ClassId")!,
            status: get<EnrollmentStatus>("EnrollmentStatus"),
          }
        : undefined,

      /* =====================================================
             STUDENT AID
             ===================================================== */

      aids:
        get("KJP") !== undefined || get("PIP") !== undefined
          ? [
              {
                academicYearId: get<string>("AidAcademicYearId")!,
                kjp: StudentExcelMapper.parseBoolean(get("KJP")),
                pip: StudentExcelMapper.parseBoolean(get("PIP")),
              },
            ]
          : undefined,
    };
  }

  /**
   * Parse boolean dari berbagai format Excel
   */
  private static parseBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null) return undefined;

    if (typeof value === "boolean") return value;

    if (typeof value === "number") return value === 1;

    if (typeof value === "string") {
      const v = value.toLowerCase();

      if (["true", "yes", "1", "ya"].includes(v)) return true;
      if (["false", "no", "0", "tidak"].includes(v)) return false;
    }

    return undefined;
  }

  /**
   * Parse tanggal dari Excel
   */
  private static parseDate(value: unknown): Date {
    if (value instanceof Date) return value;

    if (typeof value === "string") return new Date(value);

    if (typeof value === "number") {
      return new Date((value - 25569) * 86400 * 1000);
    }

    throw new Error("Invalid BirthDate value in Excel");
  }
}
