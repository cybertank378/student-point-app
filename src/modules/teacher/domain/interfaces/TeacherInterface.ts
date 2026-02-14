//Files: src/modules/teacher/domain/interfaces/TeacherInterface.ts

import type {CreateTeacherDTO} from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type {UpdateTeacherDTO} from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import type {Teacher} from "@/modules/teacher/domain/entity/Teacher";

export interface TeacherInterface {
    findAll(): Promise<Teacher[]>;
    findById(id: string): Promise<Teacher | null>;
    findByUserId(userId: string): Promise<Teacher | null>;

    create(dto: CreateTeacherDTO): Promise<Teacher>;
    update(dto: UpdateTeacherDTO): Promise<Teacher>;
    delete(id: string): Promise<void>;

    updateRoles(id: string, roles: string[]): Promise<Teacher>;
    assignHomeroom(teacherId: string, classId: string): Promise<void>;
}