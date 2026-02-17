//Files: src/modules/user/presentation/presenters/UserPresenter.ts

import type {UserEntity} from "@/modules/user/domain/entity/UserEntity";
import type {UserResponseDTO} from "@/modules/user/presentation/presenters/UserResponseDTO";


export const UserPresenter = {
    toResponse(user: UserEntity): UserResponseDTO {
        return {
            id: user.id,
            username: user.username,
            image :user.image ?? null,
            role: user.role,
            teacherRole: user.teacherRole ?? null,
            isActive: user.isActive,

            student: user.student ?? null,
            parent: user.parent ?? null,
            teacher: user.teacher ?? null,

            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    toResponseList(users: readonly UserEntity[]): UserResponseDTO[] {
        return users.map((u) => this.toResponse(u));
    },
};
