// Files : src/modules/student/domain/builder/StudentPayloadBuilder.ts

import type { Prisma } from "@/generated/prisma";

import type { CreateStudentDTO } from "@/modules/student/domain/dto/CreateStudentDTO";
import type { UpdateStudentDTO } from "@/modules/student/domain/dto/UpdateStudentDTO";

/* ============================================================
 UTIL: Normalize Nullable
 ============================================================ */

const normalizeNullable = <T>(value: T | null | undefined): T | undefined => value ?? undefined;

/* ============================================================
 CREATE PAYLOAD BUILDER
 ============================================================ */

export function buildCreateStudentPayload(dto: CreateStudentDTO): Prisma.StudentUncheckedCreateInput {
  return {
    nis: normalizeNullable(dto.nis),
    nisn: dto.nisn,

    name: dto.name,
    nickname: normalizeNullable(dto.nickname),

    gender: dto.gender,
    photo: normalizeNullable(dto.photo),

    birthPlace: dto.birthPlace,
    birthDate: dto.birthDate,

    address: dto.address,
    phone: normalizeNullable(dto.phone),
    email: normalizeNullable(dto.email),

    religionCode: dto.religionCode,

    nik: normalizeNullable(dto.nik),
    kkNumber: normalizeNullable(dto.kkNumber),

    schoolOrigin: normalizeNullable(dto.schoolOrigin),
    graduationScore: normalizeNullable(dto.graduationScore),

    instagram: normalizeNullable(dto.instagram),

    familyStatus: dto.familyStatus ?? "COMPLETE",

    isDifable: dto.isDifable ?? false,
    difableNotes: normalizeNullable(dto.difableNotes),
  };
}

/* ============================================================
 UPDATE PAYLOAD BUILDER
 ============================================================ */

export function buildUpdateStudentPayload(dto: UpdateStudentDTO): Prisma.StudentUncheckedUpdateInput {
  const data: Prisma.StudentUncheckedUpdateInput = {};

  if (dto.nis !== undefined) data.nis = dto.nis ?? undefined;
  if (dto.nisn !== undefined) data.nisn = dto.nisn;

  if (dto.name !== undefined) data.name = dto.name;
  if (dto.nickname !== undefined) data.nickname = dto.nickname ?? undefined;

  if (dto.gender !== undefined) data.gender = dto.gender;
  if (dto.photo !== undefined) data.photo = dto.photo ?? undefined;

  if (dto.birthPlace !== undefined) data.birthPlace = dto.birthPlace;
  if (dto.birthDate !== undefined) data.birthDate = dto.birthDate;

  if (dto.address !== undefined) data.address = dto.address;
  if (dto.phone !== undefined) data.phone = dto.phone ?? undefined;
  if (dto.email !== undefined) data.email = dto.email ?? undefined;

  if (dto.religionCode !== undefined) data.religionCode = dto.religionCode;

  if (dto.nik !== undefined) data.nik = dto.nik ?? undefined;
  if (dto.kkNumber !== undefined) data.kkNumber = dto.kkNumber ?? undefined;

  if (dto.schoolOrigin !== undefined) data.schoolOrigin = dto.schoolOrigin ?? undefined;

  if (dto.graduationScore !== undefined) data.graduationScore = dto.graduationScore ?? undefined;

  if (dto.instagram !== undefined) data.instagram = dto.instagram ?? undefined;

  if (dto.familyStatus !== undefined) data.familyStatus = dto.familyStatus ?? undefined;

  if (dto.isDifable !== undefined) data.isDifable = dto.isDifable;

  if (dto.difableNotes !== undefined) data.difableNotes = dto.difableNotes ?? undefined;

  return data;
}
