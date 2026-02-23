//Files: src/modules/user/domain/entity/UserEntity.ts

import type {TeacherRole, UserRole} from "@/libs/utils";

/**
 * Domain representation of User aggregate.
 * Clean One-to-Many relationship:
 *
 * - 1 Student → 1 Parent
 * - 1 Parent  → Many Students
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
    teacherId?: string | null;

    isActive: boolean;
    version: number;
    lockUntil?: Date | null;
    failedAttempts: number;

    student?: {
        id: string;
        name: string;
        nis: string | null;   // ✅ nullable Int
        nisn: string;         // ✅ NOT NULL Int
        parents: {
            id: string;
            name: string;
            phone: string;
            role: string;
        }[];
    } | null;

    parent?: {
        id: string;
        name: string;
        phone: string | null;
        students: {
            id: string;
            name: string;
            nis: string | null;
            nisn: string;
            role: string;
        }[];
    } | null;

    teacher?: {
        id: string;
        name: string;
        nip: string | null;     // ✅ nullable
        nrk: string | null;     // ✅ nullable
        nuptk: string | null;   // ✅ nullable
        nrg: string;            // ❌ NOT NULL
    } | null;

    createdAt: Date;
    updatedAt: Date;
}