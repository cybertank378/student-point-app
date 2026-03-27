//Files: src/libs/utils/enums.ts

/**
 * ============================================================
 * CENTRAL ENUM EXPORT
 * ============================================================
 *
 * Re-export Prisma enums so that the rest of the application
 * (domain, UI, application layer) does not directly depend on
 * the Prisma client package.
 *
 * Prisma schema remains the single source of truth.
 */

export {
    AttendanceStatus,
    Role,
    TeacherRole,
    EnrollmentStatus,
    Gender,
    ParentType,
    ViolationLevel,
    ViolationResolutionStatus,
    ViolationActionType,
    EducationLevel,
    CivilServantRank,
    FamilyStatus,
    CaseStatus,
    CaseSource,
    DisciplineActionType,
    HouseOwnership
} from "@/generated/prisma"

