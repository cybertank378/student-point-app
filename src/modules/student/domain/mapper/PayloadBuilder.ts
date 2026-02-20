//Files: src/modules/student/domain/mapper/PayloadBuilder.ts

/**
 * ============================================================
 * TEACHER PAYLOAD BUILDER
 * ============================================================
 *
 * Centralized builder utilities for Prisma Teacher payload.
 *
 * Responsibilities:
 * - Normalize nullable values
 * - Separate Create & Update payload types
 * - Prevent undefined leakage into Prisma
 * - Provide reusable orderBy builder
 * - Provide single include configuration
 *
 * Why separated?
 * - Prisma CreateInput ≠ UpdateInput
 * - Prevent TS2322 & type conflicts
 * - Maintain strict type-safety
 *
 * This file acts as:
 * 👉 Infrastructure-safe DTO → Prisma adapter
 */

import { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import { Prisma } from "@/generated/prisma";

/* ============================================================
   UTIL: Normalize Nullable
============================================================ */
/**
 * Convert null to undefined.
 *
 * Prisma prefers `undefined` over `null`
 * when the field is optional.
 */
const normalizeNullable = <T>(
    value: T | null | undefined
): T | undefined => value ?? undefined;

/* ============================================================
   INTERNAL BASE PAYLOAD
============================================================ */
/**
 * Shared base payload used by both
 * creation and update builders.
 *
 * DO NOT export.
 */
function buildBasePayload(
    dto: CreateTeacherDTO | UpdateTeacherDTO
) {
    return {
        nip: normalizeNullable(dto.nip),
        nuptk: normalizeNullable(dto.nuptk),
        nrk: normalizeNullable(dto.nrk),
        nrg: normalizeNullable(dto.nrg),

        name: dto.name,
        gender: dto.gender,
        religionCode: dto.religionCode,

        phone: normalizeNullable(dto.phone),
        email: normalizeNullable(dto.email),
        photo: normalizeNullable(dto.photo),

        educationLevel: dto.educationLevel,
        major: normalizeNullable(dto.major),
        graduationYear: dto.graduationYear,

        birthPlace: dto.birthPlace,
        birthDate: dto.birthDate,

        civilServantRank: normalizeNullable(dto.civilServantRank),

        roles: dto.roles,
        isPns: dto.isPns,
    };
}

/* ============================================================
   CREATE PAYLOAD BUILDER
============================================================ */
/**
 * Build strictly typed Create payload.
 *
 * Only accepts CreateTeacherDTO.
 * Safe because required fields are guaranteed.
 */
export function buildCreatePayload(
    dto: CreateTeacherDTO
): Prisma.TeacherUncheckedCreateInput {
    return buildBasePayload(dto) as Prisma.TeacherUncheckedCreateInput;
}

/* ============================================================
   UPDATE PAYLOAD BUILDER
============================================================ */
/**
 * Build partial-safe Update payload.
 *
 * Removes undefined fields to avoid:
 * - Prisma runtime errors
 * - Accidental field overwrites
 */
export function buildUpdatePayload(
    dto: UpdateTeacherDTO
): Prisma.TeacherUncheckedUpdateInput {

    const base = buildBasePayload(dto);

    return Object.fromEntries(
        Object.entries(base).filter(
            ([_, value]) => value !== undefined
        )
    ) as Prisma.TeacherUncheckedUpdateInput;
}

/* ============================================================
   RELATION INCLUDE CONFIG
============================================================ */
/**
 * Single source of truth for Teacher relation includes it.
 *
 * Prevents duplication across repository.
 */
export const teacherInclude = {
    religion: true,
    homeroomOf: true,
} satisfies Prisma.TeacherInclude;

/* ============================================================
   ORDER BY BUILDER
============================================================ */
/**
 * Strongly typed orderBy builder.
 *
 * Automatically synced with Prisma schema.
 */
type TeacherOrderableField = keyof Prisma.TeacherOrderByWithRelationInput;

export function buildOrderBy(
    sortBy?: TeacherOrderableField,
    sortOrder: Prisma.SortOrder = "asc"
): Prisma.TeacherOrderByWithRelationInput {

    if (!sortBy) {
        return { name: "asc" };
    }

    return {
        [sortBy]: sortOrder,
    };
}