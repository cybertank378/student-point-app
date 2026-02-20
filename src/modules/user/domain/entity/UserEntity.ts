//Files: src/modules/user/domain/entity/UserEntity.ts
// Files: src/modules/user/domain/entity/UserEntity.ts

import type { TeacherRole, UserRole } from "@/libs/utils";

/**
 * Domain representation of User aggregate.
 * Mirrors Prisma model but flattened for application layer.
 */
export interface UserEntity {
    id: string;
    username: string;
    password: string;
    image?: string | null;
    role: UserRole;
    teacherRole?: TeacherRole | null;

    studentId?: string | null;
    parentId?: string | null;
    teacherId?: string | null; // ✅ NEW (added)
    isActive: boolean;
    version: number;
    lockUntil?: Date | null;
    failedAttempts: number;

    // =============================
    // STUDENT PROFILE
    // =============================
    student?: {
        id: string;
        name: string;
        nis: number;
        nisn: number;
        parents: {
            id: string;
            name: string;
            phone: string;
            role: string;
        }[];
    } | null;

    // =============================
    // PARENT PROFILE
    // =============================
    parent?: {
        id: string;
        name: string;
        phone: string;
        students: {
            id: string;
            name: string;
            nis: number;
            nisn: number;
            role: string;
        }[];
    } | null;

    // =============================
    // TEACHER PROFILE
    // =============================
    teacher?: {
        id: string;
        name: string;
        nip: string | null;
        nrk: string | null;
        nuptk: string | null;
        nrg: number | null;
    } | null;

    createdAt: Date;
    updatedAt: Date;
}

