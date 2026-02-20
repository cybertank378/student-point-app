//Files: src/modules/user/presentation/presenters/UserPresenter.ts
//Files: src/modules/user/presentation/presenters/UserPresenter.ts

import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type { UserResponseDTO } from "@/modules/user/presentation/presenters/UserResponseDTO";

/**
 * ============================================================
 * USER PRESENTER
 * ============================================================
 *
 * Responsible for:
 * - Mapping UserEntity → UserResponseDTO
 * - Preventing domain leakage
 * - Controlling API response shape
 *
 * Rules:
 * - Never expose password
 * - Never expose internal relations
 * - Always normalize nullable fields
 */
export const UserPresenter = {
    toResponse(user: UserEntity): UserResponseDTO {
        return {
            id: user.id,
            username: user.username,
            image: user.image ?? null,
            role: user.role,
            teacherRole: user.teacherRole ?? null,
            isActive: user.isActive,

            /* =============================
               STUDENT PROFILE
            ============================= */
            student: user.student
                ? {
                    id: user.student.id,
                    name: user.student.name,
                    nis: user.student.nis,
                    nisn: user.student.nisn,
                }
                : null,

            /* =============================
               PARENT PROFILE
            ============================= */
            parent: user.parent
                ? {
                    id: user.parent.id,
                    name: user.parent.name,
                    phone: user.parent.phone,
                }
                : null,

            /* =============================
               TEACHER PROFILE
            ============================= */
            teacher: user.teacher
                ? {
                    id: user.teacher.id,
                    name: user.teacher.name,
                    nip: user.teacher.nip ?? "",
                    nrp: user.teacher.nip ?? "", // Not available in UserEntity
                    nuptk: user.teacher.nuptk ?? "", // Not available in UserEntity
                    nrk: user.teacher.nrk ?? "",
                    nrg: 0, // Not available in UserEntity
                }
                : null,

            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    toResponseList(users: readonly UserEntity[]): UserResponseDTO[] {
        return users.map((user) => this.toResponse(user));
    },
};