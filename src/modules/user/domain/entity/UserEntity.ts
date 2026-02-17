//Files: src/modules/user/domain/entity/UserEntity.ts
import type {TeacherRole, UserRole} from "@/libs/utils";

export interface UserEntity {
    id: string;
    username: string;
    password: string;
    image?: string | null;

    role: UserRole;
    teacherRole?: TeacherRole | null;

    studentId?: string | null;
    parentId?: string | null;

    isActive: boolean;
    version: number;
    lockUntil?: Date | null;
    failedAttempts: number;

    // =============================
    // STUDENT PROFILE (if role = STUDENT)
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
            role: string; // FATHER | MOTHER | GUARDIAN
        }[];
    } | null;

    // =============================
    // PARENT PROFILE (if role = PARENT)
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
            role: string; // FATHER | MOTHER | GUARDIAN
        }[];
    } | null;

    // =============================
    // TEACHER PROFILE (if role = TEACHER)
    // =============================
    teacher?: {
        id: string;
        name: string;
        nip: string;
    } | null;

    createdAt: Date;
    updatedAt: Date;
}
