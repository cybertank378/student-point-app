//Files: src/modules/teacher/application/usecase/UpdateTeacherUseCase.ts
import {BaseUseCase} from "@/modules/shared/core/BaseUseCase";
import type {Teacher} from "@/modules/teacher/domain/entity/Teacher";
import type {TeacherInterface} from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type {UpdateTeacherDTO} from "@/modules/teacher/domain/dto/UpdateTeacherDTO";
import {serverLog} from "@/libs/serverLogger";

/**
 * ============================================================
 * UPDATE TEACHER USE CASE
 * ============================================================
 *
 * Business Rules:
 * - Guru harus ada
 * - NIP / NUPTK / NRK harus tetap unik
 * - Tahun lulus tidak boleh di masa depan
 * - Tanggal lahir tidak boleh di masa depan
 * - Minimal memiliki satu role
 *
 * Error handling dibungkus oleh BaseUseCase.
 */
export class UpdateTeacherUseCase
    extends BaseUseCase<UpdateTeacherDTO, Teacher> {

    constructor(private readonly repo: TeacherInterface) {
        super();
    }

    /**
     * Override execute untuk logging tambahan.
     */
    async execute(dto: UpdateTeacherDTO) {
        try {
            return await super.execute(dto);
        } catch (error: unknown) {
            serverLog("UpdateTeacherUseCase Error:", error);
            throw error; // tetap dilempar agar BaseUseCase menangkapnya
        }
    }

    /**
     * Implementasi business logic pembaruan guru.
     */

    protected async handle(dto: UpdateTeacherDTO): Promise<Teacher> {

        const teacher = await this.repo.findById(dto.id);
        if (!teacher) throw new Error("Guru tidak ditemukan.");

        /**
         * ====================================================
         * NRG WAJIB
         * ====================================================
         */
        if (!dto.nrg) {
            throw new Error("NRG wajib diisi.");
        }

        if (dto.nrg < 100000000000 || dto.nrg > 999999999999) {
            throw new Error("NRG harus 12 digit angka.");
        }

        const now = new Date();

        /**
         * ====================================================
         * VALIDASI FIELD JIKA DIKIRIM
         * ====================================================
         */

        dto.roles?.length === 0 &&
        (() => {
            throw new Error("Guru minimal memiliki satu role.");
        })();

        dto.birthDate && dto.birthDate > now &&
        (() => {
            throw new Error("Tanggal lahir tidak boleh di masa depan.");
        })();

        dto.graduationYear && dto.graduationYear > now.getFullYear() &&
        (() => {
            throw new Error("Tahun lulus tidak boleh di masa depan.");
        })();

        /**
         * ====================================================
         * VALIDASI DUPLIKAT (UNIQUE CHECK)
         * ====================================================
         */

        await this.validateUnique(dto, teacher.id);

        /**
         * ====================================================
         * VALIDASI PNS RULE
         * ====================================================
         */

        const finalState = {
            isPns: dto.isPns ?? teacher.isPns,
            civilServantRank: dto.civilServantRank ?? teacher.civilServantRank,
        };

        if (finalState.isPns && !finalState.civilServantRank) {
            throw new Error("PNS wajib memiliki pangkat.");
        }

        if (!finalState.isPns && finalState.civilServantRank) {
            throw new Error("Non-PNS tidak boleh memiliki pangkat.");
        }

        /**
         * ====================================================
         * UPDATE
         * ====================================================
         */

        return this.repo.update(dto);
    }

    private async validateUnique(
        dto: UpdateTeacherDTO,
        id: string
    ) {
        if (dto.nip) {
            const t = await this.repo.findByNip(dto.nip);
            if (t && t.id !== id)
                throw new Error("NIP sudah digunakan oleh guru lain.");
        }

        if (dto.nuptk) {
            const t = await this.repo.findByNuptk(dto.nuptk);
            if (t && t.id !== id)
                throw new Error("NUPTK sudah digunakan oleh guru lain.");
        }

        if (dto.nrk) {
            const t = await this.repo.findByNrk(dto.nrk);
            if (t && t.id !== id)
                throw new Error("NRK sudah digunakan oleh guru lain.");
        }
    }

}
