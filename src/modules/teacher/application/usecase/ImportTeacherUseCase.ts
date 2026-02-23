// Files: src/modules/teacher/application/usecase/ImportTeacherUseCase.ts
import { BaseUseCase } from "@/modules/shared/core/BaseUseCase";
import type { CreateTeacherDTO } from "@/modules/teacher/domain/dto/CreateTeacherDTO";
import type { TeacherInterface } from "@/modules/teacher/domain/interfaces/TeacherInterface";
import type { z } from "zod";
import { ImportTeacherSchema } from "@/modules/teacher/infrastructure/validators/teacher.validator";
import { TeacherRole } from "@/generated/prisma";

export type ImportRows = z.infer<typeof ImportTeacherSchema>;

/**
 * ============================================================
 * IMPORT TEACHER USE CASE (FINAL CLEAN VERSION)
 * ============================================================
 *
 * Responsibility:
 * - Validate input rows
 * - Transform to CreateTeacherDTO
 * - Execute bulk import
 * - Return summary
 *
 * Not Responsible:
 * - Excel parsing
 * - File handling
 */
interface ImportSummary {
    inserted: number;
    skipped: number;
    errors: {
        row: number;
        message: string;
    }[];
}

export class ImportTeacherUseCase extends BaseUseCase<
    ImportRows,
    ImportSummary
> {
    constructor(private readonly repo: TeacherInterface) {
        super();
    }

    protected async handle(rows: ImportRows): Promise<ImportSummary> {
        if (!rows.length) {
            throw new Error("File import tidak boleh kosong.");
        }

        const errors: { row: number; message: string }[] = [];
        const validDTOs: CreateTeacherDTO[] = [];

        // 🔹 Collect identifiers
        const nips = rows.map((r) => r.nip).filter(Boolean) as string[];
        const nuptks = rows.map((r) => r.nuptk).filter(Boolean) as string[];
        const nrks = rows.map((r) => r.nrk).filter(Boolean) as string[];

        const existing = await this.repo.findExistingIdentifiers({
            nips,
            nuptks,
            nrks,
        });

        const internalNip = new Set<string>();
        const internalNuptk = new Set<string>();
        const internalNrk = new Set<string>();

        rows.forEach((row, index) => {
            const rowNumber = index + 2; // + header

            if (row.nip) {
                if (existing.nips.has(row.nip) || internalNip.has(row.nip)) {
                    errors.push({ row: rowNumber, message: "Duplicate NIP" });
                    return;
                }
                internalNip.add(row.nip);
            }

            if (row.nuptk) {
                if (existing.nuptks.has(row.nuptk) || internalNuptk.has(row.nuptk)) {
                    errors.push({ row: rowNumber, message: "Duplicate NUPTK" });
                    return;
                }
                internalNuptk.add(row.nuptk);
            }

            if (row.nrk) {
                if (existing.nrks.has(row.nrk) || internalNrk.has(row.nrk)) {
                    errors.push({ row: rowNumber, message: "Duplicate NRK" });
                    return;
                }
                internalNrk.add(row.nrk);
            }

            validDTOs.push({
                nip: row.nip ?? undefined,
                nuptk: row.nuptk ?? undefined,
                nrk: row.nrk ?? undefined,
                nrg: row.nrg,
                name: row.name,
                gender: row.gender,
                religionCode: row.religionCode,
                phone: row.phone ?? null,
                email: row.email ?? null,
                photo: row.photo ?? null,
                educationLevel: row.educationLevel,
                major: row.major ?? null,
                graduationYear: row.graduationYear,
                birthPlace: row.birthPlace,
                birthDate: row.birthDate,
                civilServantRank: row.civilServantRank ?? null,
                roles: row.roles.map((r) => r as TeacherRole),
                isPns: row.isPns,
                homeroomClassIds: [],
            });
        });

        // 🔹 Chunk Insert (50k+ safe)
        const chunkSize = 1000;
        let inserted = 0;

        await this.repo.withTransaction(async () => {
            for (let i = 0; i < validDTOs.length; i += chunkSize) {
                const chunk = validDTOs.slice(i, i + chunkSize);
                const result = await this.repo.bulkImportCreate(chunk);
                inserted += result.inserted;
            }
        });

        return {
            inserted,
            skipped: errors.length,
            errors,
        };
    }
}