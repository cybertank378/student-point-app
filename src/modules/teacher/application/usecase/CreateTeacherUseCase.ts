//Files: src/modules/teacher/application/usecase/CreateTeacherUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";

/**
 * CREATE TEACHER USE CASE
 *
 * Business Rules:
 * - Minimal 1 role
 * - BirthDate tidak boleh di masa depan
 * - GraduationYear tidak boleh di masa depan
 * - NIP/NUPTK/NRK harus unik
 */
export class CreateTeacherUseCase
    extends BaseUseCase<CreateTeacherDTO, Teacher> {

    constructor(private readonly repo: TeacherInterface) {
        super();
    }

    protected async handle(dto: CreateTeacherDTO): Promise<Teacher> {

        if (!dto.roles || dto.roles.length === 0) {
            throw new Error("Guru minimal memiliki satu role.");
        }

        const now = new Date();

        if (dto.birthDate > now) {
            throw new Error("Tanggal lahir tidak boleh di masa depan.");
        }

        if (dto.graduationYear > now.getFullYear()) {
            throw new Error("Tahun lulus tidak boleh di masa depan.");
        }

        if (dto.nip && await this.repo.findByNip(dto.nip)) {
            throw new Error("NIP sudah terdaftar.");
        }

        if (dto.nuptk && await this.repo.findByNuptk(dto.nuptk)) {
            throw new Error("NUPTK sudah terdaftar.");
        }

        if (dto.nrk && await this.repo.findByNrk(dto.nrk)) {
            throw new Error("NRK sudah terdaftar.");
        }

        return this.repo.create(dto);
    }
}

