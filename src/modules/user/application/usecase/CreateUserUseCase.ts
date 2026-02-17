//Files: src/modules/user/application/usecase/CreateUserUseCase.ts
import { Result } from "@/modules/shared/core/Result";
import type { CreateUserDTO } from "@/modules/user/domain/dto/CreateUserDTO";
import type { UserInterface } from "@/modules/user/domain/interfaces/UserInterface";
import type { HashServiceInterface } from "@/modules/auth/domain/interfaces/HashServiceInterface";
import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";

export class CreateUserUseCase {
    constructor(
        private readonly repo: UserInterface,
        private readonly hashService: HashServiceInterface,
    ) {}

    async execute(dto: CreateUserDTO): Promise<Result<UserEntity>> {
        try {
            /**
             * ===============================
             * VALIDATION
             * ===============================
             */
            if (!dto.referenceId) {
                return Result.fail("ReferenceId wajib diisi.");
            }

            if (dto.role === "TEACHER" && !dto.teacherRole) {
                return Result.fail("Guru harus memiliki TeacherRole.");
            }

            /**
             * ===============================
             * GENERATE USERNAME & PASSWORD
             * ===============================
             * Bisa kamu sesuaikan logicnya
             */
            const username = dto.referenceId;
            const defaultPassword = "123456"; // bisa diganti policy
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

            /**
             * ===============================
             * PERSIST
             * ===============================
             */
            const user = await this.repo.create({
                username,
                password: hashedPassword,
                role: dto.role,
                teacherRole: dto.teacherRole ?? null,
                studentId,
                parentId,
            });

            return Result.ok(user);
        } catch (error) {
            return Result.fail("Gagal membuat user.");
        }
    }
}
