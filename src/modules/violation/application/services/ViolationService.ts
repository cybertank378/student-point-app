//Files: src/modules/violation/application/services/ViolationService.ts

import {ListViolationUseCase} from "@/modules/violation/application/usecases/ListViolationUseCase";
import {CreateViolationUseCase} from "@/modules/violation/application/usecases/CreateViolationUseCase";
import {UpdateViolationUseCase} from "@/modules/violation/application/usecases/UpdateViolationUseCase";
import {DeleteViolationUseCase} from "@/modules/violation/application/usecases/DeleteViolationUseCase";
import type {ViolationInterface} from "@/modules/violation/domain/interfaces/ViolationInterface";
import {GetViolationByIdUseCase} from "@/modules/violation/application/usecases/GetViolationByIdUseCase";

export class ViolationService {
    private listUC: ListViolationUseCase;
    private getByIdUC: GetViolationByIdUseCase;
    private createUC: CreateViolationUseCase;
    private updateUC: UpdateViolationUseCase;
    private deleteUC: DeleteViolationUseCase;

    constructor(repo: ViolationInterface) {
        this.listUC = new ListViolationUseCase(repo);
        this.getByIdUC = new GetViolationByIdUseCase(repo);
        this.createUC = new CreateViolationUseCase(repo);
        this.updateUC = new UpdateViolationUseCase(repo);
        this.deleteUC = new DeleteViolationUseCase(repo);
    }

    list() {
        return this.listUC.execute();
    }

    getById(id: string) {
        return this.getByIdUC.execute(id);
    }

    create(dto: Parameters<CreateViolationUseCase["execute"]>[0]) {
        return this.createUC.execute(dto);
    }

    update(dto: Parameters<UpdateViolationUseCase["execute"]>[0]) {
        return this.updateUC.execute(dto);
    }

    delete(id: string) {
        return this.deleteUC.execute(id);
    }
}