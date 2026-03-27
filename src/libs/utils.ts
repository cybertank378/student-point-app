// =====================================================
// IMPORTS
// =====================================================

import { z } from "zod";
import { CIVIL_SERVANT_RANK_LABEL } from "@/libs/utils/enumLabels";
import { type CivilServantRank, FamilyStatus, HouseOwnership, type TeacherRole } from "@/libs/utils/enums";
import type AuthPayload from "@/modules/auth/domain/entity/AuthPayload";
import type { BasePaginationParams } from "@/modules/shared/http/pagination/BasePagination";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";

// =====================================================
// TIME CONSTANTS
// =====================================================

export const ONE_DAY = 24 * 60 * 60 * 1000;
export const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
export const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const ACCESS_TOKEN_EXPIRE = "1d";
export const MAX_FAILED_ATTEMPTS = 5;

export const USER_ROLES = ["ADMIN", "TEACHER", "STUDENT", "PARENT"] as const;

export const TEACHER_ROLES = ["SUBJECT_TEACHER", "HOMEROOM", "COUNSELOR", "DUTY_TEACHER"] as const;

// =====================================================
// REGEX
// =====================================================

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =====================================================
// STRING HELPERS
// =====================================================

export function getInitials(name: string) {
  const words = name.trim().split(" ");

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export function getInitial(name: string | null | undefined): string {
  if (!name) return "";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// =====================================================
// AUTH HELPERS
// =====================================================

export const redirectByRole = (role: string): string => {
  return "/dashboard";
};

export function mapToAuthPayload(decoded: AuthPayload): AuthPayload {
  return {
    sub: decoded.sub,
    username: decoded.username,
    role: decoded.role,
    teacherRole: decoded.teacherRole,
  };
}

// =====================================================
// USER DISPLAY HELPERS
// =====================================================

export const getDisplayName = (user: UserEntity): string => {
  switch (user.role) {
    case "TEACHER":
      return user.teacher?.name ?? user.username;

    case "STUDENT":
      return user.student?.name ?? user.username;

    case "PARENT":
      return user.parent?.name ?? user.username;

    default:
      return user.username;
  }
};

export const getIdentityNumber = (user: UserEntity): string | null => {
  switch (user.role) {
    case "STUDENT":
      return user.student?.nis ? `NIS: ${user.student.nis}` : null;

    case "TEACHER":
      return user.teacher?.nip ? `NIP: ${user.teacher.nip}` : null;

    case "PARENT": {
      if (!user.parent?.students?.length) return null;

      const nisList = user.parent.students.map((student) => student.nis).join(", ");

      return `NIS: ${nisList}`;
    }

    default:
      return null;
  }
};

export const getEditSubtitle = (user: UserEntity | null) => {
  if (!user) return "";

  const displayName = getDisplayName(user);
  const identity = getIdentityNumber(user);

  if (identity) {
    return `Mengedit ${displayName} • ${identity}`;
  }

  return `Mengedit ${displayName} (${user.role})`;
};

// =====================================================
// UPLOAD HELPERS
// =====================================================

export function resolveUserUploadMeta(user: UserEntity) {
  const roleFolder = user.role.toLowerCase();

  let identity: string;

  switch (user.role) {
    case "STUDENT":
      identity = String(user.student?.nis ?? user.username);
      break;

    case "TEACHER":
      identity = String(user.teacher?.nip ?? user.username);
      break;

    case "PARENT":
      identity = String(user.parent?.students?.[0]?.nis ?? user.username);
      break;

    default:
      identity = String(user.username);
  }

  const safeIdentity = identity.replace(/[^a-zA-Z0-9_-]/g, "").trim();

  return {
    roleFolder,
    identity: safeIdentity,
  };
}

export function buildUserImagePath(role?: string | null, fileName?: string | null) {
  if (!role || !fileName) {
    return "/assets/images/no_image.png";
  }

  return `/assets/upload/${role.toLowerCase()}/${fileName}`;
}

// =====================================================
// ROUTE HELPERS
// =====================================================

export function isRouteActive(path: string | undefined, pathname: string) {
  if (!path) return false;

  if (path === "/dashboard") {
    return pathname === path;
  }

  return pathname.startsWith(path);
}

// =====================================================
// ZOD HELPERS
// =====================================================

export const nullableString = () =>
  z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional();

export const nullableEmail = () =>
  z
    .string()
    .trim()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return EMAIL_REGEX.test(val);
      },
      { message: "Format email tidak valid." }
    );

// =====================================================
// ENUM LABELS
// =====================================================

export const teacherRoleLabel: Record<TeacherRole, string> = {
  SUBJECT_TEACHER: "Guru Mata Pelajaran",
  HOMEROOM: "Wali Kelas",
  COUNSELOR: "Guru BK",
  DUTY_TEACHER: "Guru Piket",
};

export const familyStatusLabel: Record<FamilyStatus, string> = {
  [FamilyStatus.COMPLETE]: "Orang Tua Lengkap",
  [FamilyStatus.SINGLE_MOTHER]: "Ibu Saja",
  [FamilyStatus.SINGLE_FATHER]: "Ayah Saja",
  [FamilyStatus.ORPHAN]: "Wali",
};

// =====================================================
// ENUM FORMATTERS
// =====================================================

export function formatRankCode(rank: CivilServantRank): string {
  return rank.replace("_", "/");
}

export function getCivilServantRankLabel(rank: CivilServantRank): string {
  return `${formatRankCode(rank)} - ${CIVIL_SERVANT_RANK_LABEL[rank]}`;
}

// =====================================================
// DOMAIN HELPERS
// =====================================================

export const RELIGION_MAP = {
  ISL: "Islam",
  KRI: "Kristen",
  KAT: "Katolik",
  HIN: "Hindu",
  BUD: "Buddha",
  KON: "Konghucu",
} as const;

export type ReligionCode = keyof typeof RELIGION_MAP;

export function getReligionName(code: string | null | undefined): string | null {
  if (!code) return null;

  return RELIGION_MAP[code as ReligionCode] ?? null;
}

export function getPnsStatus(isPns: boolean | null | undefined): string {
  return isPns ? "PNS" : "Non PNS";
}

export function getDifableStatus(isDifable: boolean | null | undefined): string {
  return isDifable ? "Difable" : "Non Difable";
}

export function formatGender(gender: string | null | undefined): string {
  if (!gender) return "-";

  const map: Record<string, string> = {
    MALE: "Laki-laki",
    FEMALE: "Perempuan",
  };

  return map[gender] ?? gender;
}

export function formatClassLabel(grade: string | null | undefined, className: string | null | undefined): string {
  if (!grade && !className) return "-";
  if (!grade) return className ?? "-";
  if (!className) return grade;

  return `${grade}-${className}`;
}

/**
 * ============================================================
 * INSTAGRAM URL HELPER
 * ============================================================
 *
 * Mengubah username instagram menjadi URL profile
 *
 * @example
 * getInstagramUrl("johndoe")
 * // https://instagram.com/johndoe
 */
export function getInstagramUrl(username?: string | null): string | null {
  if (!username) return null;

  const clean = username.replace("@", "").trim();

  return `https://instagram.com/${clean}`;
}

// =====================================================
// PAGINATION
// =====================================================

export function buildPaginationQuery(params?: BasePaginationParams): string {
  if (!params) return "";

  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));

  if (params.limit) query.append("limit", String(params.limit));

  if (params.search) query.append("search", params.search);

  if (params.sortBy) query.append("sortBy", params.sortBy);

  if (params.sortOrder) query.append("sortOrder", params.sortOrder);

  return query.toString();
}

export function bool(v?: boolean | null): string {
  if (v === undefined || v === null) return "-";
  return v ? "Ya" : "Tidak";
}

/**
 * ============================================================
 * FORMAT HOUSE OWNERSHIP LABEL
 * ============================================================
 *
 * Mengubah nilai enum HouseOwnership menjadi
 * label yang mudah dibaca dalam Bahasa Indonesia.
 *
 * Contoh:
 * OWNED -> Milik Sendiri
 * RENT -> Sewa / Kontrak
 */
export function getHouseOwnershipLabel(ownership?: string | null): string {
  switch (ownership) {
    case HouseOwnership.OWNED:
      return "Milik Sendiri";

    case HouseOwnership.RENT:
      return "Sewa / Kontrak";

    case HouseOwnership.FAMILY:
      return "Milik Keluarga";

    case HouseOwnership.GOVERNMENT:
      return "Rumah Dinas / Pemerintah";

    case HouseOwnership.OTHER:
      return "Lainnya";

    default:
      return "-";
  }
}


export const getViewerUrl = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase();

  // Office files pakai Google Viewer
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext || "")) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }

  return url;
};

export function getParentRolesByFamilyStatus(status?: string): string[] {
  switch (status) {
    case "COMPLETE":
      return ["FATHER", "MOTHER"];
    case "SINGLE_FATHER":
      return ["FATHER"];
    case "SINGLE_MOTHER":
      return ["MOTHER"];
    case "GUARDIAN":
      return ["GUARDIAN"];
    default:
      return [];
  }
}