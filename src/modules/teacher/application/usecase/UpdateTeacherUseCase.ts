// Files: src/modules/teacher/application/usecase/UpdateTeacherUseCase.ts

import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { UpdateTeacherDTO } from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import { AppError } from "@/modules/shared/errors/AppError";
import { serverLog } from "@/libs/serverLogger";

export class UpdateTeacherUseCase extends BaseUseCase<
    UpdateTeacherDTO,
    Teacher
> {
    constructor(private readonly repo: TeacherInterface) {
        super();
    }
    protected async handle(dto: UpdateTeacherDTO): Promise<Teacher> {
        if (!dto.id) {
            throw AppError.badRequest("ID guru wajib diisi.");
        }

        const existing = await this.repo.findById(dto.id);

        if (!existing) {
            throw AppError.notFound("Guru tidak ditemukan.");
        }

        const now = new Date();

        /**
         * ============================================================
         * SAFE PATCH MERGE (EXPLICIT FIELD MAPPING)
         * ============================================================
         */

        serverLog("DATA BE PHOTO : ", dto.photo)

        const merged: UpdateTeacherDTO = {
            id: existing.id,

            name: dto.name ?? existing.name,
            email: dto.email ?? existing.email,
            phone: dto.phone ?? existing.phone,
            photo: dto.photo ?? existing.photo,

            birthDate: dto.birthDate ?? existing.birthDate,
            graduationYear: dto.graduationYear ?? existing.graduationYear,

            roles: dto.roles ?? existing.roles,

            isPns: dto.isPns ?? existing.isPns,

            nip: dto.nip ?? existing.nip,
            nuptk: dto.nuptk ?? existing.nuptk,
            nrk: dto.nrk ?? existing.nrk,
            nrg: dto.nrg ?? existing.nrg,

            civilServantRank: dto.civilServantRank ?? existing.civilServantRank,
        };

        /**
         * ============================================================
         * BASIC BUSINESS VALIDATION
         * ============================================================
         */

        if ("roles" in dto && (!merged.roles || merged.roles.length === 0)) {
            throw AppError.badRequest("Guru minimal memiliki satu role.");
        }

        if (
            "birthDate" in dto &&
            merged.birthDate &&
            merged.birthDate > now
        ) {
            throw AppError.badRequest(
                "Tanggal lahir tidak boleh di masa depan."
            );
        }

        if (
            "graduationYear" in dto &&
            merged.graduationYear &&
            merged.graduationYear > now.getFullYear()
        ) {
            throw AppError.badRequest(
                "Tahun lulus tidak boleh di masa depan."
            );
        }

        /**
         * ============================================================
         * UNIQUE VALIDATION (ONLY IF FIELD SENT)
         * ============================================================
         */

        await this.validateUnique(dto, merged, existing);

        /**
         * ============================================================
         * FULLY DYNAMIC PNS VALIDATION
         * ============================================================
         */

        const finalIsPns = merged.isPns;

        /**
         * If client explicitly changes isPns
         */
        if ("isPns" in dto) {
            // TRUE → FALSE
            if (dto.isPns === false) {
                merged.nip = null;
                merged.nrk = null;
                merged.nuptk = null;
                merged.civilServantRank = null;
            }

            // FALSE → TRUE
            if (dto.isPns === true && !existing.isPns) {
                if (!merged.nip) {
                    throw AppError.badRequest("PNS wajib memiliki NIP.");
                }
                if (!merged.nrk) {
                    throw AppError.badRequest("PNS wajib memiliki NRK.");
                }
                if (!merged.civilServantRank) {
                    throw AppError.badRequest("PNS wajib memiliki pangkat.");
                }
                if (!merged.nrg) {
                    throw AppError.badRequest("NRG wajib diisi.");
                }
            }
        }

        /**
         * If still PNS → validate only fields sent
         */
        if (finalIsPns) {
            if ("nip" in dto && !merged.nip) {
                throw AppError.badRequest("PNS wajib memiliki NIP.");
            }

            if ("nrk" in dto && !merged.nrk) {
                throw AppError.badRequest("PNS wajib memiliki NRK.");
            }

            if ("civilServantRank" in dto && !merged.civilServantRank) {
                throw AppError.badRequest("PNS wajib memiliki pangkat.");
            }

            if ("nrg" in dto && !merged.nrg) {
                throw AppError.badRequest("NRG wajib diisi.");
            }
        }

        /**
         * ============================================================
         * FINAL UPDATE
         * ============================================================
         */

        return await this.repo.update(merged);
    }

    private async validateUnique(
        dto: UpdateTeacherDTO,
        merged: UpdateTeacherDTO,
        existing: Teacher
    ): Promise<void> {
        if ("nip" in dto && merged.nip && merged.nip !== existing.nip) {
            const t = await this.repo.findByNip(merged.nip);
            if (t && t.id !== existing.id) {
                throw AppError.conflict(
                    "NIP sudah digunakan oleh guru lain."
                );
            }
        }

        if (
            "nuptk" in dto &&
            merged.nuptk &&
            merged.nuptk !== existing.nuptk
        ) {
            const t = await this.repo.findByNuptk(merged.nuptk);
            if (t && t.id !== existing.id) {
                throw AppError.conflict(
                    "NUPTK sudah digunakan oleh guru lain."
                );
            }
        }

        if ("nrk" in dto && merged.nrk && merged.nrk !== existing.nrk) {
            const t = await this.repo.findByNrk(merged.nrk);
            if (t && t.id !== existing.id) {
                throw AppError.conflict(
                    "NRK sudah digunakan oleh guru lain."
                );
            }
        }
    }
}