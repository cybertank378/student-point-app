//Files: src/modules/student/domain/interfaces/GetStudentByIdUseCase.ts

import {Student} from "@/modules/student/domain/entity/Student";
import {CreateStudentDTO} from "@/modules/student/domain/dto/CreateStudentDTO";
import {UpdateStudentDTO} from "@/modules/student/domain/dto/UpdateStudentDTO";
import {StudentQueryDTO} from "@/modules/student/domain/dto/StudentQueryDTO";

export interface StudentInterface {
    findAll(query?: StudentQueryDTO): Promise<Student[]>;
    findById(id: string): Promise<Student | null>;
    findByNis(nis: number): Promise<Student | null>;

    create(dto: CreateStudentDTO): Promise<Student>;
    update(dto: UpdateStudentDTO): Promise<Student>;

    softDelete(id: string): Promise<void>;

    assignToRombel(studentId: string, rombelId: string): Promise<void>;
    batchAssignToRombel(studentIds: string[], rombelId: string): Promise<number>;
}