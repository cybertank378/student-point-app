//Files : src/modules/student-composite/domain/builder/StudentCompositeQuery.ts
import { Prisma } from "@/generated/prisma";

/**
 * ============================================================
 * STUDENT COMPOSITE QUERY
 * ============================================================
 *
 * Query builder untuk mengambil profil komposit siswa
 * dari berbagai modul child dalam satu query Prisma.
 *
 * Tujuan:
 *
 * - Menjadi Single Source of Truth untuk composite query
 * - Mengontrol payload yang diambil dari database
 * - Mengoptimalkan performa query untuk halaman detail siswa
 *
 * Digunakan oleh:
 *
 * - StudentCompositeRepository.findById()
 *
 * Catatan performa:
 *
 * - Koleksi besar dibatasi menggunakan `take`
 * - Relasi di-select secara eksplisit
 * - Urutan data menggunakan index yang sudah ada
 */

export const studentCompositeSelect = Prisma.validator<Prisma.StudentSelect>()({
  /* =====================================================
	 CORE STUDENT
	 ===================================================== */

  id: true,
  nis: true,
  nisn: true,
  name: true,
  nickname: true,
  photo: true,

  gender: true,

  birthPlace: true,
  birthDate: true,

  address: true,
  phone: true,
  email: true,

  religionCode: true,

  nik: true,
  kkNumber: true,
  schoolOrigin: true,
  graduationScore: true,
  instagram: true,

  familyStatus: true,
  isDifable: true,
  difableNotes: true,

  createdAt: true,

  /* =====================================================
	 STUDENT EXTENSIONS
	 ===================================================== */

  studentProfile: {
    select: {
      childOrder: true,
      totalSiblings: true,
      distanceToSchool: true,
      transport: true,
      hobby: true,
      dream: true,
      closeFriend: true,
    },
  },

  studentFacility: {
    select: {
      hasPC: true,
      hasLaptop: true,
      hasPhone: true,
      internetAccess: true,
    },
  },

  studentHealthAbility: {
    select: {
      inclusion: true,
      canRead: true,
      canWrite: true,
      canCount: true,
      canSpeak: true,
      canFollowCeremony: true,
      canDoSport: true,
      canSeeBoard: true,
      canHearClearly: true,
      canWalkRun: true,
      canHoldPen: true,
      dominantHandRight: true,
      diseaseHistory: true,
      hasPsychologistLetter: true,
      hasIQTest: true,
      iqScore: true,
    },
  },

  studentReligionActivity: {
    select: {
      prayFiveTimes: true,
      oftenMissPrayer: true,
      quranStudyLevel: true,
      worshipActivities: true,
      worshipLocation: true,
    },
  },

  studentFamilyInfo: {
    select: {
      livingWith: true,
      houseOwnership: true,
      headOfFamilyName: true,
      familyCardAddress: true,
      documents: true,
    },
  },

  /* =====================================================
	 DISCIPLINE POINT SUMMARY
	 ===================================================== */

  point: {
    select: {
      academicYearId: true,
      academicYear: {
        select: {
          name: true,
        },
      },

      totalViolationPoint: true,
      totalAchievementPoint: true,
      totalPoint: true,
      updatedAt: true,
    },
    orderBy: {
      academicYearId: "desc",
    },
    take: 3,
  },

  /* =====================================================
	 STUDENT AID
	 ===================================================== */

  aids: {
    select: {
      academicYearId: true,
      academicYear: {
        select: {
          name: true,
        },
      },
      kjp: true,
      pip: true,
    },
  },

  /* =====================================================
	 STUDENT ACHIEVEMENTS
	 ===================================================== */

  achievements: {
    select: {
      id: true,
      achievementId: true,
      academicYearId: true,
      academicYear: {
        select: {
          name: true,
        },
      },
      point: true,
      achievedAt: true,
    },
    orderBy: {
      achievedAt: "desc",
    },
    take: 10,
  },

  /* =====================================================
	 STUDENT ATTENDANCES
	 ===================================================== */

  attendances: {
    select: {
      date: true,
      status: true,
      note: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 30,
  },

  /* =====================================================
	 STUDENT ENROLLMENTS
	 ===================================================== */

  enrollments: {
    where: {
      deletedAt: null,
    },
    select: {
      academicYearId: true,
      academicYear: {
        select: {
          name: true,
        },
      },
      classId: true,
      class: {
        select: {
          name: true,
          grade: true,
        },
      },
      status: true,
    },
    orderBy: {
      academicYearId: "desc",
    },
    take: 5,
  },

  /* =====================================================
	 STUDENT PARENTS
	 ===================================================== */

  parents: {
    select: {
      role: true,

      parent: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,

          education: true,
          job: true,
          income: true,

          religionCode: true,
          address: true,

          guardianRelation: true,
        },
      },
    },
  },

  /* =====================================================
	 STUDENT VIOLATIONS
	 ===================================================== */

  violations: {
    select: {
      id: true,
      violationId: true,
      point: true,
      occurredAt: true,

      violation: {
        select: {
          name: true,
          level: true,
        },
      },
    },
    orderBy: {
      occurredAt: "desc",
    },
    take: 20,
  },

  /* =====================================================
	 COUNSELING CASES
	 ===================================================== */

  counselingCases: {
    select: {
      id: true,
      academicYearId: true,
      academicYear: {
        select: {
          name: true,
        },
      },
      reason: true,
      source: true,
      status: true,
      openedAt: true,
      closedAt: true,
    },
    orderBy: {
      openedAt: "desc",
    },
    take: 10,
  },
});

/**
 * ============================================================
 * STUDENT COMPOSITE PAYLOAD
 * ============================================================
 *
 * Payload Prisma yang dihasilkan dari query composite.
 *
 * Digunakan oleh:
 *
 * - StudentCompositeMapper
 */

export type StudentCompositePayload = Prisma.StudentGetPayload<{
  select: typeof studentCompositeSelect;
}>;
