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

import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";
import type { FileStorageInterface } from "@/libs/FileStorageInterface";

import { CreateUserUseCase } from "@/modules/user/application/usecase/CreateUserUseCase";
import { UpdateUserUseCase } from "@/modules/user/application/usecase/UpdateUserUseCase";
import { DeleteUserUseCase } from "@/modules/user/application/usecase/DeleteUserUseCase";
import { GetUserByIdUseCase } from "@/modules/user/application/usecase/GetUserByIdUseCase";
import { ListUserUseCase } from "@/modules/user/application/usecase/ListUserUseCase";
import { GetUserStatsUseCase } from "@/modules/user/application/usecase/GetUserStatsUseCase";
import { SearchUserUseCase } from "@/modules/user/application/usecase/SearchUserUseCase";
import {
    UploadUserImageUseCase,
    UploadUserImageRequest,
} from "@/modules/user/application/usecase/UploadUserImageUseCase";

import type { CreateUserDTO } from "@/modules/user/domain/dto/CreateUserDTO";
import type { UpdateUserDTO } from "@/modules/user/domain/dto/UpdateUserDTO";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type { Result } from "@/modules/shared/core/Result";
import type { ListUserResponseDTO } from "@/modules/user/domain/dto/ListUserResponseDTO";
import type { UserStatsResponseDTO } from "@/modules/user/domain/dto/UserStatsResponseDTO";
import type {
    UserSearchParams,
    UserSearchResult,
} from "@/modules/user/domain/interfaces/UserInterface";

import prisma from "@/libs/prisma";

export class UserService {

    private readonly createUserUseCase: CreateUserUseCase;
    private readonly updateUserUseCase: UpdateUserUseCase;
    private readonly deleteUserUseCase: DeleteUserUseCase;
    private readonly getUserByIdUseCase: GetUserByIdUseCase;
    private readonly listUserUseCase: ListUserUseCase;
    private readonly getUserStatsUseCase: GetUserStatsUseCase;
    private readonly searchUserUseCase: SearchUserUseCase;
    private readonly uploadUserImageUseCase: UploadUserImageUseCase;

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
       WRITE OPERATIONS
    ========================================================= */

    create(dto: CreateUserDTO): Promise<Result<UserEntity>> {
        return prisma.$transaction(() =>
            this.createUserUseCase.execute(dto)
        );
    }

    update(dto: UpdateUserDTO): Promise<Result<UserEntity>> {
        return this.updateUserUseCase.execute(dto);
    }

    delete(id: string): Promise<Result<void>> {
        return prisma.$transaction(() =>
            this.deleteUserUseCase.execute(id)
        );
    }

    uploadUserImage(
        request: UploadUserImageRequest
    ): Promise<Result<{ fileName: string }>> {
        return this.uploadUserImageUseCase.execute(request);
    }

    /* =========================================================
       READ OPERATIONS
    ========================================================= */

    findById(id: string): Promise<Result<UserEntity>> {
        return this.getUserByIdUseCase.execute(id);
    }

    list(params: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<Result<ListUserResponseDTO>> {
        return this.listUserUseCase.execute(params);
    }

    getStats(): Promise<Result<UserStatsResponseDTO>> {
        // BaseUseCase<void, T> → tetap butuh parameter
        return this.getUserStatsUseCase.execute(undefined as void);
    }

    search(
        params: UserSearchParams
    ): Promise<Result<UserSearchResult>> {
        return this.searchUserUseCase.execute(params);
    }
}