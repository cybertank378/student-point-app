//Files: src/modules/teacher/domain/interfaces/TeacherInterface.ts

import type {CreateTeacherDTO} from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type {UpdateTeacherDTO} from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import type {Teacher} from "@/modules/teacher/domain/entity/Teacher";
import {BasePaginationParams} from "@/modules/shared/http/pagination/BasePagination";
import {TeacherSearchParams, TeacherSearchResult} from "@/modules/teacher/domain/dto/ListTeacherRespDTO";

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

    updateRoles(id: string, roles: string[]): Promise<Teacher>;
    assignHomeroom(teacherId: string, classId: string): Promise<void>;

    search(params: TeacherSearchParams): Promise<TeacherSearchResult>;

    findByNip(nip: string): Promise<Teacher | null>;
    findByNuptk(nuptk: string): Promise<Teacher | null>;
    findByNrk(nrk: string): Promise<Teacher | null>;

    bulkCreate(data: CreateTeacherDTO[]): Promise<void>;

    findAllForExport(): Promise<ReadonlyArray<Teacher>>;



}