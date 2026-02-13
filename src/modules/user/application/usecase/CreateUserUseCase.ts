//Files: src/modules/user/application/usecase/CreateUserUseCase.ts

import { Result } from "@/modules/shared/core/Result";
import {CreateUserDTO} from "@/modules/user/domain/dto/CreateUserDTO";
import {User} from "@/modules/user/domain/entity/User";
import {UserInterface} from "@/modules/user/domain/interfaces/UserInterface";
import {HashServiceInterface} from "@/modules/auth/domain/interfaces/HashServiceInterface";

export class CreateUserUseCase {
    constructor(
        private readonly repo: UserInterface,
        private readonly hash: HashServiceInterface,
    ) {}

    async execute(
        dto: CreateUserDTO,
    ): Promise<Result<User>> {

        /**
         * ===============================
         * BUSINESS RULE VALIDATION
         * ===============================
         */
        if (
            dto.role === "TEACHER" &&
            (!dto.teacherRoles ||
                dto.teacherRoles.length === 0)
        ) {
            return Result.fail(
                "Guru harus memiliki setidaknya satu peran (TeacherRole).",
            );
        }

        /**
         * ===============================
         * HASH PASSWORD
         * ===============================
         */
        const hashedPassword =
            await this.hash.hash(dto.password);

        /**
         * ===============================
         * PERSISTENCE
         * ===============================
         */
        const user = await this.repo.create({
            ...dto,
            password: hashedPassword,
        });

        return Result.ok(user);
    }
}