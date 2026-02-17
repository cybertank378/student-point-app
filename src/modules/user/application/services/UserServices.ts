// ============================================================
// UserService
// ============================================================
//
// Application Service Layer
//
// Responsibility:
// - Orchestrate use cases
// - Define transaction boundaries
// - Expose clean API for controllers
//
// This class does NOT:
// - Contain business logic
// - Access HTTP layer
// - Access filesystem directly
//
// All business rules live inside UseCases.
// ============================================================

import type {UserInterface} from "@/modules/user/domain/interfaces/UserInterface";
import type {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";
import type {FileStorageInterface} from "@/modules/user/domain/interfaces/FileStorageInterface";

import {UpdateUserUseCase} from "@/modules/user/application/usecase/UpdateUserUseCase";
import {CreateUserUseCase} from "@/modules/user/application/usecase/CreateUserUseCase";
import {DeleteUserUseCase} from "@/modules/user/application/usecase/DeleteUserUseCase";
import {GetUserByIdUseCase} from "@/modules/user/application/usecase/GetUserByIdUseCase";
import {ListUserUseCase} from "@/modules/user/application/usecase/ListUserUseCase";
import {GetUserStatsUseCase} from "@/modules/user/application/usecase/GetUserStatsUseCase";
import {SearchUserUseCase} from "@/modules/user/application/usecase/SearchUserUseCase";
import {UploadUserImageUseCase} from "@/modules/user/application/usecase/UploadUserImageUseCase";

import type {UpdateUserDTO} from "@/modules/user/domain/dto/UpdateUserDTO";
import type {Result} from "@/modules/shared/core/Result";
import type {UserEntity} from "@/modules/user/domain/entity/UserEntity";

import prisma from "@/libs/prisma";

export class UserService {
    /* =========================================================
       UseCase Instances
    ========================================================= */

    private readonly createUserUseCase: CreateUserUseCase;
    private readonly updateUserUseCase: UpdateUserUseCase;
    private readonly deleteUserUseCase: DeleteUserUseCase;
    private readonly getUserByIdUseCase: GetUserByIdUseCase;
    private readonly listUserUseCase: ListUserUseCase;
    private readonly getUserStatsUseCase: GetUserStatsUseCase;
    private readonly searchUserUseCase: SearchUserUseCase;
    private readonly uploadUserImageUseCase: UploadUserImageUseCase;

    /* =========================================================
       Constructor
       - Inject repository & infrastructure dependency
       - Wire all use cases
    ========================================================= */

    constructor(
        userRepository: UserInterface,
        hashService: HashServiceInterface,
        fileStorage: FileStorageInterface
    ) {
        this.createUserUseCase = new CreateUserUseCase(
            userRepository,
            hashService
        );

        this.updateUserUseCase = new UpdateUserUseCase(
            userRepository,
            hashService
        );

        this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
        this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
        this.listUserUseCase = new ListUserUseCase(userRepository);
        this.getUserStatsUseCase = new GetUserStatsUseCase(userRepository);
        this.searchUserUseCase = new SearchUserUseCase(userRepository);

        this.uploadUserImageUseCase = new UploadUserImageUseCase(
            userRepository,
            fileStorage
        );
    }

    /* =========================================================
       CREATE USER
       - Wrapped in transaction
       - Guarantees atomic user creation
    ========================================================= */

    create(
        dto: Parameters<CreateUserUseCase["execute"]>[0]
    ): Promise<Result<UserEntity>> {
        return prisma.$transaction(async () => {
            return await this.createUserUseCase.execute(dto);
        });
    }

    /* =========================================================
       UPDATE USER
       - Business logic handled in UpdateUserUseCase
       - No transaction required unless extended
    ========================================================= */

    update(dto: UpdateUserDTO) {
        return this.updateUserUseCase.execute(dto);
    }

    /* =========================================================
       DELETE USER
       - Wrapped in transaction
       - Ensures referential integrity safety
    ========================================================= */

    delete(id: string): Promise<Result<void>> {
        return prisma.$transaction(async () => {
            return await this.deleteUserUseCase.execute(id);
        });
    }

    /* =========================================================
       UPLOAD USER IMAGE
       ---------------------------------------------------------
       Flow:
       1. Validate user existence
       2. Resolve dynamic folder + identity name
       3. Replace old image automatically
       4. Persist image physically via storage
       5. Update user.image column
       ---------------------------------------------------------
       Fully transactional.
    ========================================================= */

    async uploadUserImage(
        userId: string,
        file: File
    ): Promise<Result<{ fileName: string }>> {
        return await this.uploadUserImageUseCase.execute(userId, file);
    }


    /* =========================================================
       READ OPERATIONS (No transaction needed)
    ========================================================= */

    findById(id: string) {
        return this.getUserByIdUseCase.execute(id);
    }

    list(params: Parameters<ListUserUseCase["execute"]>[0]) {
        return this.listUserUseCase.execute(params);
    }

    getStats() {
        return this.getUserStatsUseCase.execute();
    }

    search(params: Parameters<SearchUserUseCase["execute"]>[0]) {
        return this.searchUserUseCase.execute(params);
    }
}
