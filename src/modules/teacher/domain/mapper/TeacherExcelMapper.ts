//Files: src/modules/teacher/domain/mapper/TeacherExcelMapper.ts
// ============================================================
// TEACHER EXCEL MAPPER (FINAL - USING DOMAIN ENTITY)
// ============================================================

import type { Teacher } from "@/modules/teacher/domain/entity/Teacher";
import type {
    Gender,
    EducationLevel,
    CivilServantRank,
    TeacherRole,
} from "@/generated/prisma";

export class TeacherExcelMapper {
    /* ==========================================================
       RAW EXCEL ROW → IMPORT RAW OBJECT (FOR ZOD)
       ========================================================== */
    toImportRows(rows: Record<string, unknown>[]) {
        return rows.map((row) => ({
            nip: row["NIP"],
            nuptk: row["NUPTK"],
            nrk: row["NRK"],
            nrg: row["NRG"],
            name: row["NAME"],
            gender: row["GENDER"] as Gender,
            religionCode: row["RELIGION"],
            phone: row["PHONE"],
            email: row["EMAIL"],
            photo: row["PHOTO"],
            educationLevel: row["EDUCATION"] as EducationLevel,
            major: row["MAJOR"],
            graduationYear: row["GRADUATION_YEAR"],
            birthPlace: row["BIRTH_PLACE"],
            birthDate: row["BIRTH_DATE"],
            civilServantRank: row["RANK"] as CivilServantRank | null,
            roles: row["ROLES"]
                ? String(row["ROLES"]).split(",") as TeacherRole[]
                : [],
            isPns: row["IS_PNS"] === "true" || row["IS_PNS"] === true,
        }));
    }

    /* ==========================================================
       TEACHER ENTITY → EXPORT ROW
       ========================================================== */
    toExportRows(teachers: ReadonlyArray<Teacher>) {
        return teachers.map((t) => ({
            NAME: t.name,
            NIP: t.nip,
            NUPTK: t.nuptk,
            NRK: t.nrk,
            NRG: t.nrg,
            GENDER: t.gender,
            RELIGION: t.religionCode,
            PHONE: t.phone,
            EMAIL: t.email,
            EDUCATION: t.educationLevel,
            MAJOR: t.major,
            GRADUATION_YEAR: t.graduationYear,
            BIRTH_PLACE: t.birthPlace,
            BIRTH_DATE: t.birthDate,
            RANK: t.civilServantRank,
            ROLES: t.roles.join(","),
            IS_PNS: t.isPns,
        }));
    }
}