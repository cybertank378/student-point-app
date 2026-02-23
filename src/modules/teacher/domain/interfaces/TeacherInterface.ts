//Files: src/modules/teacher/domain/interfaces/TeacherInterface.ts

import type {CreateTeacherDTO} from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type {UpdateTeacherDTO} from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import type {Teacher} from "@/modules/teacher/domain/entity/Teacher";
import {BasePaginationParams} from "@/modules/shared/http/pagination/BasePagination";
import {TeacherSearchParams, TeacherSearchResult} from "@/modules/teacher/domain/dto/ListTeacherRespDTO";
import {TeacherRole} from "@/generated/prisma";

export interface TeacherInterface {
    findAll(params: BasePaginationParams & {
        role?: string;
    }): Promise<{
        data: ReadonlyArray<Teacher>;
        total: number;
    }>;
    findById(id: string): Promise<Teacher | null>;
    create(dto: CreateTeacherDTO): Promise<Teacher>;
    update(dto: UpdateTeacherDTO): Promise<Teacher>;
    delete(id: string): Promise<void>;

    search(params: TeacherSearchParams): Promise<TeacherSearchResult>;

    findByNip(nip: string): Promise<Teacher | null>;
    findByNuptk(nuptk: string): Promise<Teacher | null>;
    findByNrk(nrk: string): Promise<Teacher | null>;

    /* =========================================================
    BULK IMPORT CREATE
    ========================================================= */
    bulkImportCreate(
        data: CreateTeacherDTO[]
    ): Promise<{
        inserted: number;
    }>;

    /* =========================================================
       EXPORT
    ========================================================= */
    findAllForExport(params?: {
        role?: string;
    }): Promise<ReadonlyArray<Teacher>>;

    /**
     * Bulk assign roles (atomic).
     */
    bulkAssignRoles(
        teacherIds: string[],
        roles: TeacherRole[]
    ): Promise<void>;

    /**
     * Bulk assign homeroom (atomic).
     */
    bulkAssignHomeroom(
        teacherIds: string[],
        rombelIds: string[]
    ): Promise<void>;

    /**
     * Transaction boundary.
     * Guarantees atomic execution.
     */
    withTransaction<T>(callback: () => Promise<T>): Promise<T>;


    findExistingIdentifiers(params: {
        nips: string[];
        nuptks: string[];
        nrks: string[];
    }): Promise<{
        nips: Set<string>;
        nuptks: Set<string>;
        nrks: Set<string>;
    }>;


}