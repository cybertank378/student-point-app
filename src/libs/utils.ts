
// =====================================================
// AUTH CONSTANTS
// =====================================================

import {AuthPayload} from "@/modules/auth/domain/entity/AuthPayload";

export const ONE_DAY = 24 * 60 * 60 * 1000;
export const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
export const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const ACCESS_TOKEN_EXPIRE = "1d";
export const REFRESH_TOKEN_EXPIRE = "7d";
export const ACCOUNT_LOCK_DURATION = "15m";
export const MAX_FAILED_ATTEMPTS = 5;
export const RESET_PASSWORD_EXPIRE = FIFTEEN_MINUTES;
// =====================================================
// ROLE TYPE
// =====================================================

export const USER_ROLES = [
    "ADMIN",
    "TEACHER",
    "STUDENT",
    "PARENT",
] as const;

export type UserRole = typeof USER_ROLES[number];


// =====================================================
// TEACHER ROLE
// =====================================================

export const TEACHER_ROLES = [
    "SUBJECT_TEACHER",
    "HOMEROOM",
    "COUNSELOR",
    "DUTY_TEACHER",
] as const;

export type TeacherRole = typeof TEACHER_ROLES[number];

// =====================================================
// GENERIC DASHBOARD REDIRECT
// =====================================================

export const redirectByRole = (role: string): string => {
    return "/dashboard";
};


export default function getInitials(name: string) {
    const words = name.trim().split(" ");
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }
    return (
        words[0].charAt(0) +
        words[1].charAt(0)
    ).toUpperCase();
}


export function dateFormater(dateString: Date): string {
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

export function parseDate(value: string | Date): Date {
    if (value instanceof Date) return value;

    const date = new Date(value);

    if (isNaN(date.getTime())) {
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


export function mapToAuthPayload(decoded: AuthPayload): AuthPayload {
    return {
        sub: decoded.sub,
        username: decoded.username,
        role: decoded.role,
        teacherRole: decoded.teacherRole,
    };
}


export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;