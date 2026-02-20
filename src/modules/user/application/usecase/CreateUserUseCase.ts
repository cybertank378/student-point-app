// Files: src/modules/user/application/usecase/CreateUserUseCase.ts

import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import type {CreateUserDTO} from "@/modules/user/domain/dto/CreateUserDTO";
import type {UserInterface} from "@/modules/user/domain/interfaces/UserInterface";
import type {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";
import type {UserEntity} from "@/modules/user/domain/entity/UserEntity";

/**
 * ============================================================
 * CREATE USER USE CASE
 * ============================================================
 *
 * Responsible for:
 * - Validating CreateUserDTO
 * - Generating username & default password
 * - Hashing password
 * - Mapping role to relational ID
 * - Persisting user entity
 *
 * Pattern:
 *   execute(dto) -> Result<UserEntity>
 *
 * Extends:
 *   BaseUseCase<CreateUserDTO, UserEntity>
 *
 * Notes:
 * - No try/catch here (handled by BaseUseCase)
 * - Throw Error for business rule violations
 * - BaseUseCase will convert Error into Result.fail
 */
export class CreateUserUseCase extends BaseUseCase<
    CreateUserDTO,
    UserEntity
> {
    constructor(
        private readonly repo: UserInterface,
        private readonly hashService: HashServiceInterface,
    ) {
        super();
    }

    /**
     * ============================================================
     * BUSINESS LOGIC
     * ============================================================
     *
     * This method contains pure application logic.
     * Any thrown Error will be caught by BaseUseCase.execute()
     * and transformed into Result.fail().
     */
    protected async handle(
        dto: CreateUserDTO
    ): Promise<UserEntity> {

        /**
         * ===============================
         * VALIDATION
         * ===============================
         */
        if (!dto.referenceId) {
            throw new Error("ReferenceId wajib diisi.");
        }

        if (dto.role === "TEACHER" && !dto.teacherRole) {
            throw new Error("Guru harus memiliki TeacherRole.");
        }

        /**
         * ===============================
         * GENERATE USERNAME & PASSWORD
         * ===============================
         *
         * Default Policy:
         * - Username = referenceId
         * - Default password = 123456
         *
         * You may replace this logic with:
         * - Random password generator
         * - Policy-based password
         */
        const username = dto.referenceId;
        const defaultPassword = "123456";

        const hashedPassword = await this.hashService.hash(defaultPassword);

        /**
         * ===============================
         * MAP ROLE → RELATION
         * ===============================
         */
        const studentId =
            dto.role === "STUDENT" ? dto.referenceId : null;

        const parentId =
            dto.role === "PARENT" ? dto.referenceId : null;

        return await this.repo.create({
            username,
            password: hashedPassword,
            role: dto.role,
            teacherRole: dto.teacherRole ?? null,
            studentId,
            parentId,
        });
    }
}