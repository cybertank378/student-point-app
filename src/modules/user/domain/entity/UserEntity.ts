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

    /**
     * Optional profile image
     */
    image?: string | null;

    /**
     * Primary system role (ADMIN | STUDENT | PARENT | TEACHER)
     */
    role: UserRole;

    /**
     * Secondary role if user is TEACHER
     * (e.g. SUBJECT_TEACHER, HOMEROOM, etc.)
     */
    teacherRole?: TeacherRole | null;

    /**
     * Foreign keys to profile tables
     */
    studentId?: string | null;
    parentId?: string | null;
    teacherId?: string | null; // ✅ NEW (added)

    /**
     * Security fields
     */
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
        /**
         * Teacher identification number.
         * Nullable because not all teachers have NIP.
         */
        nip: string | null;

        /**
         * Regional teacher number.
         * Nullable depending on employment type.
         */
        nrk: string | null;
    } | null;

    createdAt: Date;
    updatedAt: Date;
}

