// Files: src/modules/user/presentation/presenters/UserPresenter.ts

import type { UserEntity } from "@/modules/user/domain/entity/UserEntity";
import type { UserResponseDTO } from "./UserResponseDTO";

/**
 * ============================================================
 * USER PRESENTER
 * ============================================================
 *
 * Responsibilities:
 * - Map UserEntity → UserResponseDTO
 * - Hide sensitive fields (password)
 * - Normalize nullable values
 * - Shape API contract
 *
 * IMPORTANT:
 * - Pivot relations (StudentParent) are included
 * - No domain leakage
 * ============================================================
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

            student: user.student
                ? {
                    id: user.student.id,
                    name: user.student.name,
                    nis: user.student.nis,
                    nisn: user.student.nisn,
                    parents: user.student.parents,
                }
                : null,

            parent: user.parent
                ? {
                    id: user.parent.id,
                    name: user.parent.name,
                    phone: user.parent.phone,
                    students: user.parent.students,
                }
                : null,

            teacher: user.teacher
                ? {
                    id: user.teacher.id,
                    name: user.teacher.name,
                    nip: user.teacher.nip
                        ? user.teacher.nip.toString()
                        : null,
                    nuptk: user.teacher.nuptk
                        ? user.teacher.nuptk.toString()
                        : null,
                    nrk: user.teacher.nrk
                        ? user.teacher.nrk.toString()
                        : null,
                    nrg: user.teacher.nrg.toString(), // NOT NULL
                }
                : null,

            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    toResponseList(users: readonly UserEntity[]) {
        return users.map(this.toResponse);
    },
};