//Files: src/modules/teacher/application/usecase/ImportTeacherUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";

import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";

import type { z } from "zod";
import { ImportTeacherSchema } from "@/modules/teacher/infrastructure/validators/teacher.validator";
import {TeacherRole} from "@/generated/prisma";

export type ImportRows = z.infer<typeof ImportTeacherSchema>;

/**
 * ============================================================
 * IMPORT TEACHER USE CASE
 * ============================================================
 *
 * Business Responsibilities:
 * - Validasi file tidak kosong
 * - Mapping raw import rows → CreateTeacherDTO
 * - Delegasi bulk insert ke repository
 *
 * Error handling dilakukan oleh BaseUseCase.
 */
export class ImportTeacherUseCase extends BaseUseCase<ImportRows, string> {

    constructor(private readonly repo: TeacherInterface) {
        super();
    }

    /**
     * Implementasi logika import data guru.
     */
    protected async handle(rows: ImportRows): Promise<string> {

        /**
         * ====================================================
         * VALIDASI FILE
         * ====================================================
         */

        if (!rows.length) {
            throw new Error("File import tidak boleh kosong.");
        }

        /**
         * ====================================================
         * TRANSFORM DATA
         * ====================================================
         *
         * Mapping raw rows menjadi DTO domain.
         */

        const teachers: CreateTeacherDTO[] = rows.map((row) => ({
            nip: row.nip,
            nuptk: row.nuptk,
            nrk: row.nrk,
            nrg: row.nrg,

            name: row.name,
            gender: row.gender,

            // Pastikan sesuai DTO terbaru
            religionCode: row.religionCode,

            phone: row.phone,
            email: row.email,
            photo: row.photo,

            educationLevel: row.educationLevel,
            major: row.major,
            graduationYear: row.graduationYear,

            birthPlace: row.birthPlace,
            birthDate: row.birthDate,

            civilServantRank: row.civilServantRank,

            roles: row.roles.map((role) => role as TeacherRole),

            isPns: row.isPns
        }));

        /**
         * ====================================================
         * BULK INSERT
         * ====================================================
         */

        await this.repo.bulkCreate(teachers);

        return "Import data guru berhasil.";
    }
}
