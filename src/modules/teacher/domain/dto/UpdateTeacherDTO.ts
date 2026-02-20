// src/modules/teacher/domain/dto/UpdateTeacherDTO.ts

import type { CreateTeacherDTO } from "./CreateTeacherDTO";

/**
 * PATCH DTO
 * - id wajib
 * - semua field lain optional
 */

export type UpdateTeacherDTO =
    { id: string }
    & Partial<CreateTeacherDTO>;