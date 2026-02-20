// src/modules/teacher/domain/entity/Teacher.ts

import type {
    Gender,
    EducationLevel,
    CivilServantRank,
    TeacherRole,
} from "@/generated/prisma";

/**
 * ============================================================
 * TEACHER DOMAIN ENTITY
 * ============================================================
 *
 * Pure domain model (no Prisma dependency).
 * Immutable identity, mutable state where needed.
 */
export class Teacher {
    constructor(
        public readonly id: string,

        // Identifiers
        public readonly nip: string | null,
        public readonly nuptk: string | null,
        public readonly nrk: string | null,
        public nrg : number | null,

        // Basic
        public name: string,
        public gender: Gender,
        public religionCode: string,

        // Contact
        public phone: string | null,
        public email: string | null,
        public photo: string | null,

        // Education
        public educationLevel: EducationLevel,
        public major: string | null,
        public graduationYear: number,

        // Personal
        public birthPlace: string,
        public birthDate: Date,

        // Civil
        public civilServantRank: CivilServantRank | null,

        // Roles
        public roles: TeacherRole[],

        // Multi-year homeroom
        public homeroomClassIds: string[],

        public isPns : boolean
    ) {}
}
