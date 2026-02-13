//Files: src/modules/user/application/services/UserServices.ts

import {ListUserUseCase} from "@/modules/user/application/usecase/ListUserUseCase";
import {GetUserByIdUseCase} from "@/modules/user/application/usecase/GetUserByIdUseCase";
import {CreateUserUseCase} from "@/modules/user/application/usecase/CreateUserUseCase";
import {UpdateUserUseCase} from "@/modules/user/application/usecase/UpdateUserUseCase";
import {DeleteUserUseCase} from "@/modules/user/application/usecase/DeleteUserUseCase";
import {UserInterface} from "@/modules/user/domain/interfaces/UserInterface";
import {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";

/**
 * UserService
 * -----------
 * Aggregator seluruh usecase AuthUser
 */
export class UserService {
    private readonly listUseCase: ListUserUseCase;
    private readonly getByIdUseCase: GetUserByIdUseCase;
    private readonly createUseCase: CreateUserUseCase;
    private readonly updateUseCase: UpdateUserUseCase;
    private readonly deleteUseCase: DeleteUserUseCase;

    constructor(
        private readonly repo: UserInterface,
        private readonly hash: HashServiceInterface,
    ) {
        this.listUseCase = new ListUserUseCase(repo);
        this.getByIdUseCase = new GetUserByIdUseCase(repo);
        this.createUseCase = new CreateUserUseCase(repo, hash);
        this.updateUseCase = new UpdateUserUseCase(repo, hash);
        this.deleteUseCase = new DeleteUserUseCase(repo);
    }

    create(dto: Parameters<CreateUserUseCase["execute"]>[0]) {
        return this.createUseCase.execute(dto);
    }

    update(dto: Parameters<UpdateUserUseCase["execute"]>[0]) {
        return this.updateUseCase.execute(dto);
    }

    delete(id: string) {
        return this.deleteUseCase.execute(id);
    }

    getById(id: string) {
        return this.getByIdUseCase.execute(id);
    }

    list() {
        return this.listUseCase.execute();
    }
}
