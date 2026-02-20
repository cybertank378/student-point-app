//Files: src/modules/user/application/usecase/UpdateUserUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { UpdateUserDTO } from "@/modules/user/domain/dto/UpdateUserDTO";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type {
    UserInterface,
    UpdateUserData,
} from "@/modules/user/domain/interfaces/UserInterface";
import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";

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
     * Business logic implementation.
     * Throw error for failure.
     * Return entity for success.
     */
    protected async handle(dto: UpdateUserDTO): Promise<UserEntity> {
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

        const updated = await this.repo.update(dto.id, updatePayload);

        return updated;
    }

    /* =========================================================
       PRIVATE METHODS
    ========================================================= */

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

        // Rule 3: TEACHER must always have teacherRole.
        if (
            dto.role === "TEACHER" &&
            dto.teacherRole == null
        ) {
            throw new Error(
                "Teacher harus memiliki TeacherRole."
            );
        }
    }

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

