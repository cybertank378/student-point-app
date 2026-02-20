// Files: src/modules/teacher/domain/dto/TeacherDTO.ts


/* ============================================================
 * COMMON SORT TYPES
 * ============================================================ */

import {CivilServantRank, EducationLevel, Gender, TeacherRole} from "@/generated/prisma";

/**
 * ============================================================
 * SORTABLE FIELDS (Single Source of Truth)
 * ============================================================
 */

export const teacherSortFields = [
    "name",
    "nip",
    "nuptk",
    "nrk",
    "roles",
    "createdAt",
] as const;

/**
 * Derived union type from const array.
 * Fully type-safe & runtime-safe.
 */
export type TeacherSortField = (typeof teacherSortFields)[number];

export type SortOrder = "asc" | "desc";

/* ============================================================
 * LIST / BASIC FILTER PARAMS (UI Friendly)
 * ============================================================ */

export interface ListTeacherParams {
    page?: number;
    limit?: number;
    search?: string;
    nrk?: string;
    nuptk?: string;
    nip?: string;
    role?: TeacherRole;
    religionCode?: string;
    sortBy?: TeacherSortField;
    sortOrder?: SortOrder;
}

/* ============================================================
 * RESPONSE DTO
 * ============================================================ */

export interface TeacherRespDTO {
    id: string;

    // Identifiers
    nip: string | null;
    nuptk: string | null;
    nrk: string | null;
    nrg : number | null;

    // Basic
    name: string;
    gender: Gender;
    religionCode: string; // ✅ SESUAI ENTITY

    // Contact
    phone: string | null;
    email: string | null;
    photo: string | null;

    // Education
    educationLevel: EducationLevel;
    major: string | null;
    graduationYear: number;

    // Personal
    birthPlace: string;
    birthDate: Date;

    // Civil
    civilServantRank: CivilServantRank | null;

    // Roles
    roles: readonly TeacherRole[];

    // Multi-year homeroom
    homeroomClassIds: string[];

    isPns : boolean
}


export interface ListTeacherRespDTO {
    data: readonly TeacherRespDTO[];
    total: number;
    page: number;
    limit: number;
}

/* ============================================================
 * DOMAIN SEARCH (ENTITY BASED – DOMAIN LAYER ONLY)
 * ============================================================ */

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";

export interface TeacherSearchParams {
    page: number;
    limit: number;

    name?: string;
    role?: TeacherRole;
    religionCode?: string;

    sortBy?: TeacherSortField;
    sortOrder?: SortOrder;
}

export interface TeacherSearchResult {
    data: ReadonlyArray<Teacher>;
    total: number;
    page: number;
    limit: number;
}



