/**
 * ============================================================
 * TEACHER PAYLOAD BUILDER (STRING VERSION)
 * ============================================================
 */

import { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import { Prisma } from "@/generated/prisma";

/* ============================================================
   UTIL: Normalize Nullable
============================================================ */
const normalizeNullable = <T>(
    value: T | null | undefined
): T | undefined => value ?? undefined;

/* ============================================================
   CREATE PAYLOAD BUILDER
============================================================ */
export function buildCreatePayload(
    dto: CreateTeacherDTO
): Prisma.TeacherUncheckedCreateInput {

    if (!dto.nrg) {
        throw new Error("NRG is required for teacher creation.");
    }

    return {
        // ✅ STRING DIRECT
        nip: normalizeNullable(dto.nip),
        nuptk: normalizeNullable(dto.nuptk),
        nrk: normalizeNullable(dto.nrk),

        // REQUIRED
        nrg: dto.nrg,

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
   UPDATE PAYLOAD BUILDER
============================================================ */
export function buildUpdatePayload(
    dto: UpdateTeacherDTO
): Prisma.TeacherUncheckedUpdateInput {

    const data: Prisma.TeacherUncheckedUpdateInput = {};

    if (dto.nip !== undefined) data.nip = dto.nip ?? undefined;
    if (dto.nuptk !== undefined) data.nuptk = dto.nuptk ?? undefined;
    if (dto.nrk !== undefined) data.nrk = dto.nrk ?? undefined;
    if (dto.nrg !== undefined) data.nrg = dto.nrg;

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.gender !== undefined) data.gender = dto.gender;
    if (dto.religionCode !== undefined) data.religionCode = dto.religionCode;

    if (dto.phone !== undefined) data.phone = dto.phone ?? undefined;
    if (dto.email !== undefined) data.email = dto.email ?? undefined;
    if (dto.photo !== undefined) data.photo = dto.photo ?? undefined;

    if (dto.educationLevel !== undefined)
        data.educationLevel = dto.educationLevel;

    if (dto.major !== undefined)
        data.major = dto.major ?? undefined;

    if (dto.graduationYear !== undefined)
        data.graduationYear = dto.graduationYear;

    if (dto.birthPlace !== undefined)
        data.birthPlace = dto.birthPlace;

    if (dto.birthDate !== undefined)
        data.birthDate = dto.birthDate;

    if (dto.civilServantRank !== undefined)
        data.civilServantRank = dto.civilServantRank ?? undefined;

    if (dto.roles !== undefined)
        data.roles = dto.roles;

    if (dto.isPns !== undefined)
        data.isPns = dto.isPns;

    return data;
}

/* ============================================================
   RELATION INCLUDE CONFIG
============================================================ */
export const teacherInclude = {
    religion: true,
    homeroomOf: true,
} satisfies Prisma.TeacherInclude;

/* ============================================================
   ORDER BY BUILDER
============================================================ */
type TeacherOrderableField =
    keyof Prisma.TeacherOrderByWithRelationInput;

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