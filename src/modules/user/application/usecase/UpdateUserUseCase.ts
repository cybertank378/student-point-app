// Files: src/modules/user/application/usecase/UpdateUserUseCase.ts

import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import type {UpdateUserDTO} from "@/modules/user/domain/dto/UpdateUserDTO";
import type {UserEntity} from "@/modules/user/domain/entity/UserEntity";
import type {UpdateUserData, UserInterface,} from "@/modules/user/domain/interfaces/UserInterface";
import type {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";

/**
 * ============================================================
 * UPDATE USER USE CASE
 * ============================================================
 *
 * Responsible for:
 * - Validating user existence
 * - Enforcing business rules
 * - Handling password update logic
 * - Handling account unlock logic
 * - Updating user data
 *
 * Pattern:
 *   execute(dto) -> Result<UserEntity>
 *
 * Extends:
 *   BaseUseCase<UpdateUserDTO, UserEntity>
 *
 * Notes:
 * - No try/catch (handled by BaseUseCase)
 * - Throw Error for business rule violations
 * - Fully isolated business orchestration
 */
export class UpdateUserUseCase extends BaseUseCase<
    UpdateUserDTO,
    UserEntity
> {
    constructor(
        private readonly repo: UserInterface,
        private readonly hashService: HashServiceInterface
    ) {
        super();
    }

    /**
     * ============================================================
     * BUSINESS LOGIC
     * ============================================================
     *
     * Steps:
     * 1. Validate input
     * 2. Ensure a user exists
     * 3. Validate business rules
     * 4. Resolve password update
     * 5. Handle account unlocks logic
     * 6. Persist update
     *
     * Any thrown Error will be caught by BaseUseCase.execute()
     */
    protected async handle(dto: UpdateUserDTO): Promise<UserEntity> {

        /* =========================================================
           BASIC VALIDATION
        ========================================================= */

        if (!dto.id) {
            throw new Error("User ID wajib diisi.");
        }

        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            throw new Error("User tidak ditemukan.");
        }

        /* =========================================================
           BUSINESS RULE VALIDATION
        ========================================================= */

        this.validateBusinessRules(existing, dto);

        /* =========================================================
           PASSWORD HANDLING
        ========================================================= */

        const { hashedPassword, passwordChanged } =
            await this.resolvePassword(existing, dto);

        /* =========================================================
           ACCOUNT LOCK HANDLING
        ========================================================= */

        const unlockAccount =
            existing.lockUntil !== null && dto.isActive;

        /* =========================================================
           BUILD UPDATE PAYLOAD
        ========================================================= */

        const updatePayload: UpdateUserData = {
            password: hashedPassword,
            role: dto.role,
            teacherRole:
                dto.role === "TEACHER"
                    ? dto.teacherRole ?? null
                    : null,
            isActive: dto.isActive,
            image: dto.image ?? null,
            mustChangePassword: passwordChanged,
            lockUntil: unlockAccount ? null : existing.lockUntil,
            failedAttempts: unlockAccount
                ? 0
                : existing.failedAttempts,
            updatedAt: new Date(),
        };

        return await this.repo.update(dto.id, updatePayload);
    }

    /* =========================================================
       PRIVATE METHODS
    ========================================================= */

    /**
     * Validate domain-specific business rules.
     * Throws Error if the rule is violated.
     */
    private validateBusinessRules(
        existing: UserEntity,
        dto: UpdateUserDTO
    ): void {

        // Rule 1: ADMIN accounts cannot be deactivated.
        if (existing.role === "ADMIN" && !dto.isActive) {
            throw new Error(
                "User ADMIN tidak boleh dinonaktifkan."
            );
        }

        // Rule 2: STUDENT role is immutable.
        if (
            existing.role === "STUDENT" &&
            dto.role !== "STUDENT"
        ) {
            throw new Error(
                "Role siswa tidak dapat diubah."
            );
        }

        // Rule 3: TEACHER must always have a teacherRole.
        if (
            dto.role === "TEACHER" &&
            dto.teacherRole == null
        ) {
            throw new Error(
                "Teacher harus memiliki TeacherRole."
            );
        }
    }

    /**
     * Resolve password update logic.
     *
     * If a password is provided:
     *   - Hash new password
     *   - Mark mustChangePassword = true
     *
     * If not provided:
     *   - Keep an existing password
     */
    private async resolvePassword(
        existing: UserEntity,
        dto: UpdateUserDTO
    ): Promise<{
        hashedPassword: string;
        passwordChanged: boolean;
    }> {

        const newPassword = dto.password?.trim();

        if (newPassword) {
            const hashed = await this.hashService.hash(newPassword);
            return {
                hashedPassword: hashed,
                passwordChanged: true,
            };
        }

        return {
            hashedPassword: existing.password,
            passwordChanged: false,
        };
    }
}