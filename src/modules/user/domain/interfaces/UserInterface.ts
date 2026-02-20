//Files: src/modules/user/domain/interfaces/UserInterface.ts
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type { TeacherRole, UserRole } from "@/libs/utils";

/* ============================================================
 * USER SEARCH PARAMS (B-TREE FRIENDLY)
 * ============================================================
 *
 * - Prefix search (startsWith)
 * - Exact match filtering
 * - Date range (gte/lte)
 * - Sorting aligned with composite index
 */

export interface UserSearchParams {
    page: number;
    limit: number;
    username?: string;
    role?: UserRole;
    isActive?: boolean;
    teacherRole?: TeacherRole;
    createdFrom?: Date;
    createdTo?: Date;

    sortBy?: "createdAt" | "username";
    sortOrder?: "asc" | "desc";
}

/* ============================================================
 * USER SEARCH RESULT
 * ============================================================
 */

export interface UserSearchResult {
    data: ReadonlyArray<UserEntity>;
    total: number;
    page: number;
    limit: number;
}

/* ============================================================
 * USER DOMAIN INTERFACE
 * ============================================================
 */

export interface UpdateUserData {
    password?: string;
    role?: UserRole;
    teacherRole?: TeacherRole | null;
    isActive?: boolean;
    image?: string | null;
    refreshToken?: string | null;
    failedAttempts?: number;
    lockUntil?: Date | null;
    mustChangePassword?: boolean;
    updatedAt?: Date; // for optimistic concurrency
}

export interface UserInterface {

    findAll(): Promise<ReadonlyArray<UserEntity>>;

    findById(id: string): Promise<UserEntity | null>;

    create(data: {
        username: string;
        password: string;
        role: UserRole;
        teacherRole?: TeacherRole | null;
        studentId?: string | null;
        parentId?: string | null;
    }): Promise<UserEntity>;

    update(
        id: string,
        data: UpdateUserData
    ): Promise<UserEntity>;


    delete(id: string): Promise<void>;

    /**
     * Basic list (legacy/simple)
     */
    list(params: {
        page: number;
        limit: number;
        search?: string;
    }): Promise<{
        data: ReadonlyArray<UserEntity>;
        total: number;
    }>;

    search(params: UserSearchParams): Promise<UserSearchResult>;

    getUserStats(): Promise<{
        totalActiveUsers: number;
        totalStudentUsers: number;
        totalParentUsers: number;
        totalTeacherUsers: number;
    }>;
}
