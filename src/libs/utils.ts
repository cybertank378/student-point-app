// =====================================================
// AUTH CONSTANTS
// =====================================================

import type AuthPayload from "@/modules/auth/domain/entity/AuthPayload";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import {CivilServantRank} from "@/generated/prisma";
import {z} from "zod";

// =====================================================
// TIME CONSTANTS
// =====================================================

export const ONE_DAY = 24 * 60 * 60 * 1000;
export const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
export const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const ACCESS_TOKEN_EXPIRE = "1d";
export const MAX_FAILED_ATTEMPTS = 5;

// =====================================================
// ROLE TYPES
// =====================================================

export const USER_ROLES = [
    "ADMIN",
    "TEACHER",
    "STUDENT",
    "PARENT",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

// =====================================================
// TEACHER ROLE
// =====================================================

export const TEACHER_ROLES = [
    "SUBJECT_TEACHER",
    "HOMEROOM",
    "COUNSELOR",
    "DUTY_TEACHER",
] as const;

export type TeacherRole = (typeof TEACHER_ROLES)[number];




// =====================================================
// GENERIC HELPERS
// =====================================================

export const redirectByRole = (role: string): string => {
    return "/dashboard";
};

export function getInitials(name: string) {
    const words = name.trim().split(" ");
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export function dateFormater(input: Date | string | null | undefined): string {
    if (!input) return "-";

    const date = input instanceof Date ? input : new Date(input);

    if (isNaN(date.getTime())) return "-";

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}


export function parseDate(value: string | Date): Date {
    if (value instanceof Date) return value;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }

    return date;
}

export function formatDateForInput(value: string | Date): string {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function mapToAuthPayload(
    decoded: AuthPayload
): AuthPayload {
    return {
        sub: decoded.sub,
        username: decoded.username,
        role: decoded.role,
        teacherRole: decoded.teacherRole,
    };
}

// =====================================================
// REGEX
// =====================================================

export const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =====================================================
// USER DISPLAY HELPERS
// =====================================================

export const getDisplayName = (
    user: UserEntity
): string => {
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

export const getIdentityNumber = (
    user: UserEntity
): string | null => {
    switch (user.role) {
        case "STUDENT":
            return user.student?.nis
                ? `NIS: ${user.student.nis}`
                : null;

        case "TEACHER":
            return user.teacher?.nip
                ? `NIP: ${user.teacher.nip}`
                : null;

        case "PARENT":
            if (!user.parent?.students?.length) return null;

            const nisList = user.parent.students
                .map((student) => student.nis)
                .join(", ");

            return `NIS: ${nisList}`;

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


export const getInitial = (
    name: string | null | undefined
): string => {
    if (!name) return "";

    const parts = name
        .trim()
        .split(" ")
        .filter(Boolean);

    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
};

// =====================================================
// UPLOAD META RESOLVER
// =====================================================

/**
 * Resolve upload folder & identity filename
 * based on user role.
 *
 * Folder:
 * - admin
 * - teacher
 * - student
 * - parent
 *
 * Filename:
 * - STUDENT → nis
 * - TEACHER → nip
 * - PARENT  → nis anak
 * - ADMIN   → username
 */
export function resolveUserUploadMeta(
    user: UserEntity
) {
    const roleFolder = user.role.toLowerCase();

    let identity: string;

    switch (user.role) {
        case "STUDENT":
            identity = String(
                user.student?.nis ?? user.username
            );
            break;

        case "TEACHER":
            identity = String(
                user.teacher?.nip ?? user.username
            );
            break;

        case "PARENT":
            identity = String(
                user.parent?.students?.[0]?.nis ??
                user.username
            );
            break;

        case "ADMIN":
        default:
            identity = String(user.username);
            break;
    }

    // sanitize filename
    const safeIdentity = identity
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .trim();

    return {
        roleFolder,
        identity: safeIdentity,
    };
}


export function buildUserImagePath(
    role?: string | null,
    fileName?: string | null,
) {
    if (!role || !fileName) {
        return "/assets/images/no_image.png";
    }

    return `/assets/upload/${role.toLowerCase()}/${fileName}`;
}


export function isRouteActive(path: string | undefined, pathname: string) {
    if (!path) return false;

    if (path === "/dashboard") {
        return pathname === path;
    }

    return pathname.startsWith(path);
}

/**
 * Helper untuk string nullable & optional.
 * Mengubah string kosong menjadi null.
 */
export const nullableString = () =>
    z
        .string()
        .trim()
        .transform((val) => (val === "" ? null : val))
        .nullable()
        .optional();

/**
 * Email nullable & optional.
 * String kosong → null
 */
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

export const teacherRoleLabel: Record<TeacherRole, string> = {
    SUBJECT_TEACHER: "Guru Mata Pelajaran",
    HOMEROOM: "Wali Kelas",
    COUNSELOR: "Guru BK",
    DUTY_TEACHER: "Guru Piket",
};



export const GENDER = [
    "MALE",
    "FEMALE",
] as const;

export type Gender = (typeof GENDER)[number];



export const EDUCATION_LEVEL = [
    "SD",
    "SMP",
    "SMA",
    "DI",
    "DII",
    "DIII",
    "DIV",
    "S1",
    "S2",
    "S3",
] as const;

export type EducationRank = (typeof EDUCATION_LEVEL)[number];




export const CIVIL_RANK = [
    "I_A",
    "I_B",
    "I_C",
    "I_D",
    "II_A",
    "II_B",
    "II_C",
    "II_D",
    "III_A",
    "III_B",
    "III_C",
    "III_D",
    "IV_A",
    "IV_B",
    "IV_C",
    "IV_D",
    "IV_E",
] as const;

export type CivilRank = (typeof CIVIL_RANK)[number];
export const civilServantRankLabel: Record<CivilServantRank, string> = {
    I_A: "Juru Muda",
    I_B: "Juru Muda Tingkat I",
    I_C: "Juru",
    I_D: "Juru Tingkat I",

    II_A: "Pengatur Muda",
    II_B: "Pengatur Muda Tingkat I",
    II_C: "Pengatur",
    II_D: "Pengatur Tingkat I",

    III_A: "Penata Muda",
    III_B: "Penata Muda Tingkat I",
    III_C: "Penata",
    III_D: "Penata Tingkat I",

    IV_A: "Pembina",
    IV_B: "Pembina Tingkat I",
    IV_C: "Pembina Utama Muda",
    IV_D: "Pembina Utama Madya",
    IV_E: "Pembina Utama",
};


/**
 * ============================================================
 * RELIGION HELPER
 * ============================================================
 * Convert religion code → religion name
 * Fully type-safe
 * No any
 * Reusable across domain
 * ============================================================
 */

export const RELIGION_MAP = {
    ISL: "Islam",
    KRI: "Kristen",
    KAT: "Katolik",
    HIN: "Hindu",
    BUD: "Buddha",
    KON: "Konghucu",
} as const;

/**
 * Type of valid religion codes
 */
export type ReligionCode = keyof typeof RELIGION_MAP;

/**
 * Get religion name from code
 */
export function getReligionName(
    code: string | null | undefined
): string | null {
    if (!code) return null;

    return RELIGION_MAP[code as ReligionCode] ?? null;
}

/**
 * ============================================================
 * TEACHER HELPER
 * ============================================================
 * Convert isPns boolean → label string
 * ============================================================
 */

/**
 * Convert isPns → "PNS" | "Non PNS"
 */
export function getPnsStatus(
    isPns: boolean | null | undefined
): string {
    if (isPns === true) return "PNS";
    return "Non PNS";
}


/**
 * Map label pangkat PNS
 */
export const CIVIL_SERVANT_RANK_LABEL: Record<
    CivilServantRank,
    string
> = {
    I_A: "Juru Muda",
    I_B: "Juru Muda Tingkat I",
    I_C: "Juru",
    I_D: "Juru Tingkat I",

    II_A: "Pengatur Muda",
    II_B: "Pengatur Muda Tingkat I",
    II_C: "Pengatur",
    II_D: "Pengatur Tingkat I",

    III_A: "Penata Muda",
    III_B: "Penata Muda Tingkat I",
    III_C: "Penata",
    III_D: "Penata Tingkat I",

    IV_A: "Pembina",
    IV_B: "Pembina Tingkat I",
    IV_C: "Pembina Utama Muda",
    IV_D: "Pembina Utama Madya",
    IV_E: "Pembina Utama",
};

/**
 * Convert I_A → I/A
 */
export function formatRankCode(
    rank: CivilServantRank
): string {
    return rank.replace("_", "/");
}

/**
 * Get full display label
 * Example: I_A → I/A - Juru Muda
 */
export function getCivilServantRankLabel(
    rank: CivilServantRank
): string {
    return `${formatRankCode(rank)} - ${
        CIVIL_SERVANT_RANK_LABEL[rank]
    }`;
}