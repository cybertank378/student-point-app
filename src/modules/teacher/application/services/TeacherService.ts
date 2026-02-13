//Files: src/modules/teacher/application/services/TeacherService.ts
import type { Result } from "@/modules/shared/core/Result";

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import type { AssignTeacherRoleDTO } from "@/modules/teacher/domain/dto/AssignTeacherRoleDTO";
import {ListTeacherUseCase} from "@/modules/teacher/application/usecase/ListTeacherUseCase";
import {GetTeacherByIdUseCase} from "@/modules/teacher/application/usecase/GetTeacherByIdUseCase";
import {CreateTeacherUseCase} from "@/modules/teacher/application/usecase/CreateTeacherUseCase";
import {UpdateTeacherUseCase} from "@/modules/teacher/application/usecase/UpdateTeacherUseCase";
import {DeleteTeacherUseCase} from "@/modules/teacher/application/usecase/DeleteTeacherUseCase";
import {AssignTeacherRoleUseCase} from "@/modules/teacher/application/usecase/AssignTeacherRoleUseCase";
import {AssignHomeroomUseCase} from "@/modules/teacher/application/usecase/AssignHomeroomUseCase";


export class TeacherService {
    private readonly listUC: ListTeacherUseCase;
    private readonly getUC: GetTeacherByIdUseCase;
    private readonly createUC: CreateTeacherUseCase;
    private readonly updateUC: UpdateTeacherUseCase;
    private readonly deleteUC: DeleteTeacherUseCase;
    private readonly assignRoleUC: AssignTeacherRoleUseCase;
    private readonly assignHomeroomUC: AssignHomeroomUseCase;

    constructor(repo: TeacherInterface) {
        this.listUC = new ListTeacherUseCase(repo);
        this.getUC = new GetTeacherByIdUseCase(repo);
        this.createUC = new CreateTeacherUseCase(repo);
        this.updateUC = new UpdateTeacherUseCase(repo);
        this.deleteUC = new DeleteTeacherUseCase(repo);
        this.assignRoleUC = new AssignTeacherRoleUseCase(repo);
        this.assignHomeroomUC = new AssignHomeroomUseCase(repo);
    }

    getAll(): Promise<Result<Teacher[]>> {
        return this.listUC.execute();
    }

    getById(id: string): Promise<Result<Teacher>> {
        return this.getUC.execute(id);
    }

    create(dto: CreateTeacherDTO) {
        return this.createUC.execute(dto);
    }

    update(dto: UpdateTeacherDTO) {
        return this.updateUC.execute(dto);
    }

    delete(id: string) {
        return this.deleteUC.execute(id);
    }

    assignRole(dto: AssignTeacherRoleDTO) {
        return this.assignRoleUC.execute(dto);
    }

    assignHomeroom(teacherId: string, classId: string) {
        return this.assignHomeroomUC.execute(teacherId, classId);
    }
}
