
// =====================================================
// AUTH CONSTANTS
// =====================================================

export const ONE_DAY = 24 * 60 * 60 * 1000;
export const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
export const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const ACCESS_TOKEN_EXPIRE = FIFTEEN_MINUTES;
export const REFRESH_TOKEN_EXPIRE = SEVEN_DAYS;
export const ACCOUNT_LOCK_DURATION = FIFTEEN_MINUTES;
export const MAX_FAILED_ATTEMPTS = 5;
export const RESET_PASSWORD_EXPIRE = FIFTEEN_MINUTES;

// =====================================================
// ROLE TYPE
// =====================================================

export type UserRole =
    | "ADMIN"
    | "TEACHER"
    | "STUDENT"
    | "PARENT";


// =====================================================
// TEACHER ROLE
// =====================================================

export type TeacherRole =
    | "SUBJECT_TEACHER"
    | "HOMEROOM"
    | "COUNSELOR"
    | "DUTY_TEACHER";

/**
 * =====================================================
 * PERMISSION TYPE
 * =====================================================
 */

export type Permission =
    | "DASHBOARD_VIEW"
    | "USER_READ"
    | "SETTINGS_READ"
    | "STUDENT_READ"
    | "VIOLATION_READ"
    | "MY_VIOLATION_READ"
    | "CHILD_REPORT_READ";

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