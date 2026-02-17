//Files: src/modules/user/application/usecase/UpdateUserUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { UpdateUserDTO } from "@/modules/user/domain/dto/UpdateUserDTO";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type {
    UserInterface,
    UpdateUserData,
} from "@/modules/user/domain/interfaces/UserInterface";
import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";

export class UpdateUserUseCase {
    constructor(
        private readonly repo: UserInterface,
        private readonly hashService: HashServiceInterface
    ) {}

    async execute(dto: UpdateUserDTO): Promise<Result<UserEntity>> {
        try {
            const existing = await this.repo.findById(dto.id);

            if (!existing) {
                return Result.fail("User tidak ditemukan.");
            }

            /* =========================================================
               BUSINESS RULE VALIDATION
            ========================================================= */

            const ruleValidation = this.validateBusinessRules(existing, dto);

            if (ruleValidation.isFailure) {
                return ruleValidation as Result<UserEntity>;
            }

            /* =========================================================
               PASSWORD HANDLING (Partial Update Safe)
            ========================================================= */

            const { hashedPassword, passwordChanged } =
                await this.resolvePassword(existing, dto);

            /* =========================================================
               ACCOUNT LOCK HANDLING
               - If user is reactivated, clear lock state.
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

            return Result.ok(updated);
        } catch (error) {
            // TODO: replace with proper logger if available
            console.error("UpdateUserUseCase Error:", error);
            return Result.fail("Gagal memperbarui user.");
        }
    }

    /* =========================================================
       PRIVATE METHODS
    ========================================================= */

    /**
     * Enforce domain invariants before update.
     */
    private validateBusinessRules(
        existing: UserEntity,
        dto: UpdateUserDTO
    ): Result<void> {
        // Rule 1: ADMIN accounts cannot be deactivated.
        if (existing.role === "ADMIN" && !dto.isActive) {
            return Result.fail(
                "User ADMIN tidak boleh dinonaktifkan."
            );
        }

        // Rule 2: STUDENT role is immutable.
        if (
            existing.role === "STUDENT" &&
            dto.role !== "STUDENT"
        ) {
            return Result.fail(
                "Role siswa tidak dapat diubah."
            );
        }

        // Rule 3: TEACHER must always have a teacherRole.
        if (
            dto.role === "TEACHER" &&
            dto.teacherRole == null
        ) {
            return Result.fail(
                "Teacher harus memiliki TeacherRole."
            );
        }

        return Result.ok();
    }

    /**
     * Hash password only if a valid new password is provided.
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


